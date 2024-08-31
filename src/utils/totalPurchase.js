export const totalPurchase = (totalProducts) => {
    let totalByProducts = totalProducts.map(item => (item.quantity * item.product.price))
    let total = totalByProducts.reduce((acc, item) => parseInt(acc + item), 0)
    return total
}