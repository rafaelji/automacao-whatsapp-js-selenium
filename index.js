import csv from 'csvtojson';
import pkg from 'selenium-webdriver';

const {Builder, By, Key, until} = pkg;

const go = async() => {
    const searchContactXpath = '/html[@class=\'js serviceworker adownload cssanimations csstransitions webp webp-alpha webp-animation webp-lossless\']/body[@class=\'web\']/div[@id=\'app\']/div[@class=\'_3h3LX _34ybp app-wrapper-web font-fix\']/div[@class=\'_3QfZd two\']/div[@class=\'_1Flk2 _2DPZK\']/div[@id=\'side\']/div[@class=\'SgIJV\']/div[@class=\'_3LX7r\']/label[@class=\'RPX_m\']/div[@class=\'_1JAUF _1d1OL\']/div[@class=\'_2_1wd copyable-text selectable-text\']';
    const driver = await new Builder().forBrowser('chrome').build();
    const csvPath = './concent-list.csv';

    try {
        await driver.get('https://web.whatsapp.com/');
        await driver.wait(until.elementLocated(By.xpath(searchContactXpath), 1000));

        const concentList = await csv({delimiter: ';'}).fromFile(csvPath);

        for(let index = 0; index < concentList.length; index++) {
            const searchInput = driver.findElement(By.xpath(searchContactXpath));
            searchInput.click();
            await searchInput.sendKeys(concentList[index]['Nome Completo']);
            await driver.wait(() => setTimeout(() => true, 5000), 1000);
            await searchInput.sendKeys(Key.ENTER);
            const messageInput = await driver.findElement(By.className('_1JAUF _2x4bz focused'));
            const messageDiv = await messageInput.findElements(By.css('div'));
            await messageDiv[1].sendKeys('Olá!\n' +
                'Segue abaixo link nominal e intransferível contendo "Termo de Consentimento", que autoriza que a Igreja Adventista do Sétimo Dia armazene eticamente no sistema de secretaria (ACMS) seus dados, como nome, endereço, telefone, igreja que frequenta, distrito, histórico etc, em conformidade com a Nova Lei de Proteção de Dados.');
            await driver.findElement(By.className('_1E0Oz')).click();
            await messageDiv[1].sendKeys(concentList[index]['CONSENT LINK']);
            await driver.findElement(By.className('_1E0Oz')).click();
        }

    } catch(error) {
        console.log("Deu erro:", error);
    } finally {
        // await driver.quit();
    }
};

await go();