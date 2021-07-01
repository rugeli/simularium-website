import { expect } from "chai";
import * as React from "react";

import { bindAll, convertToSentenceCase, wrapText } from "../";
import { isGoogleDriveUrl, urlCheck } from "../userUrlHandling";

describe("General utilities", () => {
    describe("bindAll", () => {
        it("binds class methods to a class", () => {
            class Foo extends React.Component {
                private message = "Hello from Foo";

                constructor(props: any) {
                    super(props);
                    bindAll(this, [this.bar]);
                }

                public bar() {
                    return this.message;
                }
            }

            const foo = new Foo({});
            const bar = foo.bar;
            expect(foo.bar()).to.equal(bar());
        });

        it("does not bind a method that it was not asked to bind", () => {
            class Foo extends React.Component {
                private message = "Hello from Foo";

                constructor(props: {}) {
                    super(props);
                    bindAll(this, [this.bar]);
                }

                public bar() {
                    return this.message;
                }

                public baz() {
                    return this.message;
                }
            }

            const foo = new Foo({});
            const baz = foo.baz;

            expect(foo.baz()).to.equal("Hello from Foo");
            expect(baz).to.throw(TypeError);
        });
    });

    describe("toSentenceCase", () => {
        it("takes a string and converts it to sentence case", () => {
            const startingString = "all lowercase. all lowercase";
            expect(convertToSentenceCase(startingString)).to.equal(
                "All lowercase. All lowercase"
            );
        });
        it("ignores camelcase", () => {
            const startingString = "all lowercase. has camelCase";
            expect(convertToSentenceCase(startingString)).to.equal(
                "All lowercase. Has camelCase"
            );
        });
        it("fixes mid sentence caps", () => {
            const startingString = "all lowercase. has Mid sentence cap";
            expect(convertToSentenceCase(startingString)).to.equal(
                "All lowercase. Has mid sentence cap"
            );
        });
    });

    describe("wrapText", () => {
        it("does not wrap a 1-word title", () => {
            expect(wrapText("1234567890", 8)).to.deep.equal({
                formattedText: "1234567890",
                numLines: 1,
            });
        });
        it("wraps a title with a long first word", () => {
            expect(wrapText("1234567890 abc", 8)).to.deep.equal({
                formattedText: "1234567890<br>abc",
                numLines: 2,
            });
        });
        it("does not wrap text shorter than maximum character length", () => {
            expect(wrapText("12345 7", 8)).to.deep.equal({
                formattedText: "12345 7",
                numLines: 1,
            });
        });
        it("wraps text longer than maximum character length", () => {
            expect(wrapText("123 567 890 abcdefg wxyz", 8)).to.deep.equal({
                formattedText: "123 567<br>890<br>abcdefg<br>wxyz",
                numLines: 4,
            });
        });
    });
});

describe("User Url handling", () => {
    describe("urlCheck", () => {
        it("returns strings that match the regex", () => {
            const shouldMatch = [
                "https://aics-agentviz-data.s3.us-east-2.amazonaws.com/trajectory/endocytosis.simularium",
                "https://aics-agentviz-data.s3.us-east-2.amazonaws.com/trajectory/endocytosis.json",
                "http://web5-site.com/directory",
                "https://fa-st.web9site.com/directory/file.filename",
                "https://fa-st.web9site.com/directory-name/file.filename",
                "https://website.com/directory/?key=val",
                "http://www.website.com/?key=val#anchor",
                "https://drive.google.com/uc?export=download&id=1HH5KBpH7QAiwqw-qfm0_tfkTO3XC8afR",
            ];
            const result = shouldMatch.map(urlCheck);
            expect(result).to.deep.equal(shouldMatch);
        });
        it("returns an empty string if give a non string", () => {
            const shouldNotMatch = [[], {}, 2, null, undefined];
            const result = shouldNotMatch.map(urlCheck);
            expect(result).to.deep.equal(Array(shouldNotMatch.length).fill(""));
        });
        it("returns an empty string if the given string is not an accepted url", () => {
            const shouldNotMatch = [
                "website.com/?querystring",
                "www.website.com/?key=val",
                "http://website.c-om/directory",
                "https://website",
                "fast..web9site.com/directory/file.filename",
                "web?site.com",
                "website...com/??querystring",
                "www.w;ebsite.?com/",
            ];
            const result = shouldNotMatch.map(urlCheck);
            expect(result).to.deep.equal(Array(shouldNotMatch.length).fill(""));
        });
    });
    describe("isGoogleDriveUrl", () => {
        it("returns true if the url has google.com in it", () => {
            const shouldMatch = [
                "https://google.com.amazonaws.com/trajectory/endocytosis.simularium",
                "https://drive.google.com/file/d/1HH5KBpH7QAiwqw-qfm0_tfkTO3XC8afR/view",
                "https://drive.google.com/uc?export=download&id=1HH5KBpH7QAiwqw-qfm0_tfkTO3XC8afR",
            ];
            const result = shouldMatch.map(isGoogleDriveUrl);
            expect(result).to.deep.equal([true, true, true]);
        });
    });
});
