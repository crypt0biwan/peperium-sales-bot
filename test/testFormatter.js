const { formatDiscordMessage, formatTwitterMessage } = require('../utils/format');

const mockTwitterClient = {
	v1: {
		uploadMedia: async function(cardPath) {
			console.log("mocked uploadMedia(): " + cardPath)
			return "unit-test";
		}
	}
}

const assert = require("assert");

const singleSale = {
	data: { '10': 1 },
	totalPrice: 0.3,
	buyer: '0x2757476cd6a9efeb748e2f0c747d7b3c7002219b',
	seller: '0xf481db34ed8844ce98ce339c5fd01ef8d4261955',
	ethPrice: 2036.2552894003065,
	token: 'ETH',
	platforms: [ 'OpenSea' ]
};

const singleSaleMultipleQty = {
	data: { '9': 23 },
	totalPrice: 7.5,
	buyer: '0x2757476cd6a9efeb748e2f0c747d7b3c7002219b',
	seller: '0xf481db34ed8844ce98ce339c5fd01ef8d4261955',
	ethPrice: 2036.2552894003065,
	token: 'ETH',
	platforms: [ 'OpenSea' ]
};

const multiSale = {
	data: { '9': 2, '10': 1, '11': 3},
	totalPrice: 1.24,
	buyer: '0x2757476cd6a9efeb748e2f0c747d7b3c7002219b',
	seller: '0xf481db34ed8844ce98ce339c5fd01ef8d4261955',
	ethPrice: 2036.2552894003065,
	token: 'ETH',
	platforms: [ 'OpenSea' ]

}

const multiSaleWithMoreThan4 = {
	data: { '9': 2, '10': 1, '11': 3, '12': 4, '13': 5, '14': 6},
	totalPrice: 10,
	buyer: '0x2757476cd6a9efeb748e2f0c747d7b3c7002219b',
	seller: '0xf481db34ed8844ce98ce339c5fd01ef8d4261955',
	ethPrice: 2036.2552894003065,
	token: 'ETH',
	platforms: [ 'OpenSea' ]

}

describe("Formatter", function () {
	this.timeout(10_000);

	describe("formatDiscordMessage()", function () {
		it("should format single sales correctly", async function () {
			const discordMsg = await formatDiscordMessage(singleSale);
			console.log(JSON.stringify(discordMsg, null, 4));
		});
	});

	describe("formatTwitterMessage()", function () {
		it("should format single sales correctly", async function () {
			const [twitterMessage, mediaIds] = await formatTwitterMessage(mockTwitterClient, singleSale);

			console.log(twitterMessage);
			const expectedMessage = `Curio Card 10 sold for 0.3 ETH ($610.88) on OpenSea!\n\nhttps://opensea.io/assets/0x73da73ef3a6982109c4d5bdb0db9dd3e3783f313/10`;
			assert.equal(expectedMessage, twitterMessage);

			console.log(mediaIds);
			assert.equal(mediaIds.length, 1);
			assert.notEqual(mediaIds[0], null);
			assert.notEqual(mediaIds[0], "");
		});

		it("should format single sales (with >1 quantity) correctly", async function () {
			const [twitterMessage, mediaIds] = await formatTwitterMessage(mockTwitterClient, singleSaleMultipleQty);

			console.log(twitterMessage);
			const expectedMessage = `23x Curio Card 9 sold for 7.5 ETH ($15271.91) on OpenSea!\n\nhttps://opensea.io/assets/0x73da73ef3a6982109c4d5bdb0db9dd3e3783f313/9`;
			assert.equal(expectedMessage, twitterMessage);

			console.log(mediaIds);
			assert.equal(mediaIds.length, 1);
			assert.notEqual(mediaIds[0], null);
			assert.notEqual(mediaIds[0], "");
		});

		it("should format multi-card sales correctly", async function () {
			const [twitterMessage, mediaIds] = await formatTwitterMessage(mockTwitterClient, multiSale);

			console.log(twitterMessage);
			const expectedMessage = `Multiple Curio Cards sold for a total of 1.24 ETH ($2524.96)!\n2x Curio 9\n1x Curio 10\n3x Curio 11`;
			assert.equal(expectedMessage, twitterMessage);

			console.log(mediaIds);
			assert.equal(mediaIds.length, 3);
			assert.notEqual(mediaIds[0], null);
			assert.notEqual(mediaIds[0], "");
		});

		it("should format multi-card sales (with >4 different cards) correctly", async function () {
			const [twitterMessage, mediaIds] = await formatTwitterMessage(mockTwitterClient, multiSaleWithMoreThan4);

			console.log(twitterMessage);
			const expectedMessage = `Multiple Curio Cards sold for a total of 10 ETH ($20362.55)!\n2x Curio 9\n1x Curio 10\n3x Curio 11\n4x Curio 12\n5x Curio 13\n6x Curio 14`;
			assert.equal(expectedMessage, twitterMessage);

			console.log(mediaIds);
			assert.equal(mediaIds.length, 4);
			assert.notEqual(mediaIds[0], null);
			assert.notEqual(mediaIds[0], "");
		});
	});
});