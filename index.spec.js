/* eslint-env jest */

const demoLoader = require("./index");
const mockFs = require("mock-fs");

function delay(timeInMs = 0) {
    return new Promise(resolve => {
        setTimeout(resolve, timeInMs);
    });
}

describe("Demo Loader (when markdown exists)", () => {

    beforeEach(() => {
        mockFs({
            "some/resource/file.js": "some source code",
            "some/resource/file.md": "some markdown"
        });
    });

    afterEach(() => mockFs.restore());

    it("runs successfully", () => {

        expect.assertions(2);

        const loaderCallback = jest.fn();
        const context = {
            async: () => loaderCallback,
            resource: "some/resource/file.js",
            addDependency: jest.fn(() => { /* do nothing */ })
        };

        const remainingRequest = "someRemainingRequest";
        demoLoader.pitch.apply(context, [remainingRequest]);        

        const expectedModuleCode = `
module.exports = require("!!someRemainingRequest");
const rawSource = "some source code";
const markdown = "some markdown";
if (module.exports.default) {
    module.exports.default.__source__ = rawSource;
    module.exports.default.__markdown__ = markdown;
}
module.exports.__source = rawSource;
module.exports.__markdown__ = markdown;
`;

        return delay().then(() => {
            expect(loaderCallback).toHaveBeenCalledWith(null, expectedModuleCode);
            expect(context.addDependency).toHaveBeenCalledWith("some/resource/file.md");
        });

    });

});

describe("Demo Loader (when markdown does not exist)", () => {

    beforeEach(() => {
        mockFs({
            "some/resource/file.js": "some source code"
        });
    });

    afterEach(() => mockFs.restore());

    it("runs successfully", () => {

        expect.assertions(2);

        const loaderCallback = jest.fn();
        const context = {
            async: () => loaderCallback,
            resource: "some/resource/file.js",
            addDependency: jest.fn(() => { /* do nothing */ })
        };

        const remainingRequest = "someRemainingRequest";
        demoLoader.pitch.apply(context, [remainingRequest]);

        const expectedModuleCode = `
module.exports = require("!!someRemainingRequest");
const rawSource = "some source code";
const markdown = "";
if (module.exports.default) {
    module.exports.default.__source__ = rawSource;
    module.exports.default.__markdown__ = markdown;
}
module.exports.__source = rawSource;
module.exports.__markdown__ = markdown;
`;

        return delay().then(() => {
            expect(loaderCallback).toHaveBeenCalledWith(null, expectedModuleCode);
            expect(context.addDependency).not.toHaveBeenCalled();
        });

    });

});
