const { assert } = require("chai")
require('chai')
  .use(require('chai-as-promised'))
  .should()


const Market = artifacts.require('./Market.sol')

contract('Market', ([deployer, seller , buyer]) => {
  let market

  before(async () => {
    market = await Market.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await market.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await market.name()
      assert.equal(name, 'Riep')
    })

  })


  describe('products', async () => {
    let result,productCount
    before(async () => {
        result = await market.createProduct('First Product', web3.utils.toWei('1', 'Ether'), {from: seller})
        productCount = await market.productCount()
      })

    it('creates Product', async () => {
      const name = await market.name()
      assert.equal(productCount, 1)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
        assert.equal(event.name, 'First Product', 'name is correct')
        assert.equal(event.owner,seller,'owner is correct')
        assert.equal(event.purchased,false,'purchased is correct')
      
    })
    it('lists Product', async () => {
     
        const product = await market.products(productCount)
        assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct')
        assert.equal(product.name, 'First Product', 'name is correct')
        assert.equal(product.owner,seller,'owner is correct')
        assert.equal(product.purchased,false,'purchased is correct')
    })

    it('sells product', async ()=> {

      let oldSellerBalance
      oldSellerBalance = await web3.eth.getBalance(seller)
      oldSellerBalance = new web3.utils.BN(oldSellerBalance)
      result = await market.purchaseProduct(productCount, {from: buyer, value: web3.utils.toWei('1', 'Ether')})
    
      const name = await market.name()
      assert.equal(productCount, 1)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
        assert.equal(event.name, 'First Product', 'name is correct')
        assert.equal(event.owner,buyer,'owner is correct')
        assert.equal(event.purchased,true,'purchased is correct')
    
      //check if seller recieved funds

      let newSellerBalance
      newSellerBalance = await web3.eth.getBalance(seller)
      newSellerBalance = new web3.utils.BN(newSellerBalance)

      let price
      price = web3.utils.toWei('1', 'Ether')
      price = new web3.utils.BN(price)

      console.log(oldSellerBalance, newSellerBalance,price)
      const expectedBalance = oldSellerBalance.add(price)
      assert.equal(newSellerBalance.toString(),expectedBalance.toString())
    

    //bug test
    //id
    await market.purchaseProduct(99, {from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;  
    await market.purchaseProduct(productCount, {from: buyer, value: web3.utils.toWei('0.4', 'Ether')}).should.be.rejected;
    await market.purchaseProduct(productCount, {from: deployer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;    
    await market.purchaseProduct(productCount, {from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;  
    })

  })

})