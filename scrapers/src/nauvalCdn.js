const axios = require("axios");
const crypto = require("crypto");
const FormData = require("form-data");
const {
    fromBuffer
} = require("file-type");
const fakeUserAgent = require("fake-useragent");
const uloadUrlRegexStr = /url: "([^"]+)"/;
const randomBytes = crypto.randomBytes(5).toString("hex");

const createFormData = (content, fieldName, ext) => {
    const {
        mime
    } = fromBuffer(content) || {};
    const formData = new FormData();
    formData.append(fieldName, content, `${randomBytes}.${ext}`);
    return formData;
};

async function nauvalCdn(content) {
    try {
        const {
            ext,
            mime
        } = (await fromBuffer(content)) || {};
        const formData = await createFormData(content, "file", ext);
        let hanako = await axios.post('https://Nauval.mycdn.biz.id/upload',
            formData, {
                headers: {
                    "User-Agent": fakeUserAgent(),
                },
            },
        );
        return hanako.data;
    } catch (err) {
        return {
            success: false,
            message: err
        };
        console.log({
            success: false,
            message: err
        });
    }
};

module.exports = nauvalCdn
