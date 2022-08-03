const cds = require('@sap/cds')
const { Products } = cds.entities

/** Service implementation for CatalogService */
module.exports = cds.service.impl(srv => {
  srv.before ('CREATE', 'Orders', _reduceStock)
})


/** Reduce stock of ordered products if available stock suffices */
async function _reduceStock (req) {
    const { Items: orderItems } = req.data
    const tx = cds.transaction(req);
    return Promise.all(orderItems.map(item => {
        console.log(item)
        tx.run(
            UPDATE(Products)
            .where({ID: item.product_ID})
            .and('stock >=', item.amount)
            .set('stock -=', item.amount)

        ).then(affectedRow => {
            console.log(affectedRow)
            if (affectedRow == 0) {
                req.error(409, `${item.amount} exceeds stock for product #${item.product_ID}`)
            }
        })
    }))
}