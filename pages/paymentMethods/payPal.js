const { settle } = require('../../utils/dynamicWait');
const { TIMEOUTS } = require('../../config/constants');

class PayPalPage {
    constructor(page) {
        this.page = page;
    }

    async fillPayPalDetails() {
        console.log("Filling PayPal details...");
        await settle(this.page, TIMEOUTS.fieldBlur);

    }
}