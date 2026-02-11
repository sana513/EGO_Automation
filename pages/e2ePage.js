const BasePage = require("./basePage");
const LogoutPage = require("./logoutPage");
const { testData } = require("../config/testData");

class E2EPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
        this.logoutPage = new LogoutPage(page);
    }

    async performLogout() {
        console.log("Performing logout in E2E unified flow...");
        await this.logoutPage.performLogout();
    }
}

module.exports = E2EPage;
