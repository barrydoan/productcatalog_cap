const cds = require('@sap/cds')
const { Carts, CartItems, Products } = cds.entities


/** Service implementation for CatalogService */
module.exports = cds.service.impl(srv => {
   srv.after(['CREATE', 'UPDATE'], 'CartItems', _updateCartTotal)
})


/**
 * Update cart total when adding or removing an item out of an order
 * 
 * @param {*} req 
 */
async function _updateCartTotal(data) {
    console.log('This is the after service')       
    console.log(data)
    let cartitem = await cds.run(
        SELECT.from(CartItems).byKey(data.ID)
    )
    let cart = await cds.run(
        SELECT.from(Carts).byKey(cartitem.parent_ID)
    )
    // select all item of card
    let cartItems = await cds.run(
        SELECT.from(CartItems).where({parent_ID: cart.ID})
    )
    // update total
    var total = 0
    cartItems.map(item => {
        total += item.amount * parseFloat(item.netAmount)
    })
    console.log('total', total)
    // update cart
    await cds.run(
        UPDATE(Carts, cart.ID)
        .with({total})
    )

}