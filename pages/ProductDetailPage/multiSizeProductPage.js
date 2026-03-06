const { pdpLocators } = require('../../locators/pdpLocators');
const { pdpLabels } = require('../../config/egoLabels');
const { pdpLogs } = require('../../config/egoLogs');
const { testData } = require('../../config/testData');
const { getRandomIndex } = require('../../features/support/utils');

class MultiSizeProductPage {

    constructor(page) {
        this.page = page;

        this.sizeSelectorButton = pdpLocators.sizeSelectorButton;
        this.sizeOptions = pdpLocators.sizeOptions;
        this.sizeSpan = pdpLocators.sizeSpan;
        this.nativeSelectLocator = pdpLocators.nativeSelectLocator;
        this.blockingOverlay = pdpLocators.blockingOverlay;
        this.dropdownList = pdpLocators.dropdownList;
        this.labels = pdpLabels;
        this.logs = pdpLogs;
    }

    async detectSizeDropdownType() {

        const nativeSelects = this.page.locator(this.nativeSelectLocator);
        const nativeCount = await nativeSelects.count();

        if (nativeCount > 0) {
            for (let i = 0; i < nativeCount; i++) {
                const select = nativeSelects.nth(i);
                const isVisible = await select.isVisible({ timeout: 1000 }).catch(() => false);
                const isEnabled = await select.isEnabled().catch(() => false);
                
                if (isVisible && isEnabled) {
                    console.log(`${this.logs.detectedNativeSelect} ${nativeCount} native HTML select element(s)`);
                    return 'native';
                }
            }
        }

        const customDropdown = this.page.locator(this.sizeSelectorButton).first();
        const isCustomVisible = await customDropdown.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (isCustomVisible) {
            console.log(this.logs.detectedCustomDropdown);
            return 'custom';
        }

        return 'none';
    }

    async openSizeDropdown() {

        const dropdown = this.page.locator(this.sizeSelectorButton).first();

        await dropdown.waitFor({
            state: 'visible',
            timeout: testData.timeouts.medium
        });
        const overlay = this.page.locator(this.blockingOverlay);
        if (await overlay.isVisible().catch(() => false)) {
            throw new Error(this.logs.cannotOpenDropdown);
        }

        await dropdown.click();
        
        await this.page.waitForTimeout(800);
    }

    async getAvailableSizesFromCustomDropdown() {

        const sizeItems = this.page.locator(this.sizeOptions);

        try {
            await sizeItems.first().waitFor({
                state: 'visible',
                timeout: testData.timeouts.xlarge
            });
        } catch (error) {
            const dropdownOpen = await this.page.locator(this.dropdownList).isVisible().catch(() => false);
            if (!dropdownOpen) {
                throw new Error(this.logs.dropdownNotOpen);
            }
            throw new Error(`${this.logs.sizeOptionsNotLoad} ${error.message}`);
        }
        await this.page.waitForTimeout(500);

        const count = await sizeItems.count();
        const availableSizes = [];

        for (let i = 0; i < count; i++) {

            const listItem = sizeItems.nth(i);
            const itemText = await listItem.textContent();

            const hasNotifyMe =
                itemText &&
                itemText.includes(this.labels.notifyMe);

            const sizeSpan =
                listItem.locator(this.sizeSpan).first();

            const disabled =
                await sizeSpan.getAttribute('disabled');

            const sizeText =
                await sizeSpan.textContent();

            if (
                !hasNotifyMe &&
                !disabled &&
                sizeText &&
                sizeText.trim() !== ''
            ) {
                availableSizes.push({
                    element: sizeSpan,
                    text: sizeText.trim(),
                    type: 'custom'
                });
            }
        }

        return availableSizes;
    }

    async getAvailableSizesFromNativeSelect() {

        const selectElements = this.page.locator(this.nativeSelectLocator);
        const selectCount = await selectElements.count();

        for (let i = 0; i < selectCount; i++) {
            const select = selectElements.nth(i);
            
            const isVisible = await select.isVisible().catch(() => false);
            const isEnabled = await select.isEnabled().catch(() => false);

            if (!isVisible || !isEnabled) {
                continue;
            }

            const options = select.locator('option');
            const optionCount = await options.count();
            const availableSizes = [];

            for (let j = 0; j < optionCount; j++) {
                const option = options.nth(j);
                const text = await option.textContent();
                const value = await option.getAttribute('value');
                const disabled = await option.getAttribute('disabled');

                const isAvailable = disabled === null && value && value.trim() !== '';
                const isPlaceholder = text && text.toLowerCase().includes('select');

                if (isAvailable && !isPlaceholder) {
                    availableSizes.push({
                        selectElement: select,
                        selectIndex: i,
                        text: text.trim(),
                        value: value,
                        type: 'native'
                    });
                }
            }

            if (availableSizes.length > 0) {
                return availableSizes;
            }
        }

        return [];
    }

    async getAvailableSizes() {

        const dropdownType = await this.detectSizeDropdownType();

        if (dropdownType === 'native') {
            return await this.getAvailableSizesFromNativeSelect();
        } else if (dropdownType === 'custom') {
            return await this.getAvailableSizesFromCustomDropdown();
        } else {
            throw new Error(this.logs.noSizeSelector);
        }
    }

    async selectRandomSize() {

        console.log(this.logs.selectingRandomSize);

        const dropdownType = await this.detectSizeDropdownType();

        if (dropdownType === 'native') {
            return await this.selectRandomSizeFromNativeSelect();
        } else if (dropdownType === 'custom') {
            return await this.selectRandomSizeFromCustomDropdown();
        } else {
            throw new Error(this.logs.noSizeSelector);
        }
    }

    async selectRandomSizeFromNativeSelect() {

        const sizes = await this.getAvailableSizesFromNativeSelect();

        if (sizes.length === 0) {
            throw new Error(this.logs.noAvailableSizesNative);
        }

        const randomIndex = getRandomIndex(sizes.length);
        const selectedSize = sizes[randomIndex];

        console.log(`${this.logs.selectedSizeNative} ${selectedSize.text} (native select #${selectedSize.selectIndex})`);

        await selectedSize.selectElement.selectOption({ value: selectedSize.value });
        await this.page.waitForTimeout(500);

        return selectedSize.text;
    }

    async selectRandomSizeFromCustomDropdown() {

        await this.openSizeDropdown();

        const sizes = await this.getAvailableSizesFromCustomDropdown();

        if (sizes.length === 0) {
            throw new Error(this.logs.noAvailableSizesCustom);
        }

        const randomIndex = getRandomIndex(sizes.length);
        const selectedSize = sizes[randomIndex];

        console.log(`${this.logs.selectedSize} ${selectedSize.text}`);

        await selectedSize.element.scrollIntoViewIfNeeded();
        await selectedSize.element.click();

        return selectedSize.text;
    }

    async selectSizeByText(size) {

        const dropdownType = await this.detectSizeDropdownType();

        if (dropdownType === 'native') {
            return await this.selectSizeByTextFromNativeSelect(size);
        } else if (dropdownType === 'custom') {
            return await this.selectSizeByTextFromCustomDropdown(size);
        } else {
            throw new Error(this.logs.noSizeSelector);
        }
    }

    async selectSizeByTextFromNativeSelect(size) {

        const selectElements = this.page.locator(this.nativeSelectLocator);
        const selectCount = await selectElements.count();

        for (let i = 0; i < selectCount; i++) {
            const select = selectElements.nth(i);
            
            const isVisible = await select.isVisible().catch(() => false);
            const isEnabled = await select.isEnabled().catch(() => false);

            if (!isVisible || !isEnabled) {
                continue;
            }

            const options = select.locator('option');
            const optionCount = await options.count();

            for (let j = 0; j < optionCount; j++) {
                const option = options.nth(j);
                const text = await option.textContent();
                const value = await option.getAttribute('value');
                const disabled = await option.getAttribute('disabled');

                if (text.trim() === size) {
                    if (disabled !== null) {
                        console.log(`${this.logs.sizeFoundDisabled} ${size} found but is disabled in select #${i}`);
                        continue;
                    }
                    console.log(`${this.logs.selectedSizeNative} ${size} (native select #${i})`);
                    await select.selectOption({ value: value });
                    await this.page.waitForTimeout(500);
                    return;
                }
            }
        }

        throw new Error(`${this.logs.sizeNotFoundInNative} ${size} not found in native select.`);
    }

    async selectSizeByTextFromCustomDropdown(size) {

        await this.openSizeDropdown();

        const sizeItems = this.page.locator(this.sizeOptions);
        const count = await sizeItems.count();

        for (let i = 0; i < count; i++) {

            const sizeSpan =
                sizeItems.nth(i).locator(this.sizeSpan).first();

            const sizeText =
                await sizeSpan.textContent();

            if (sizeText.trim() === size) {

                await sizeSpan.click();
                return;
            }
        }

        throw new Error(`${this.logs.sizeNotFoundInCustom} ${size} not found in custom dropdown.`);
    }
}

module.exports = MultiSizeProductPage;