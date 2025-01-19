exports.getEmailTemplate = (type, details) => {
    switch (type) {
        case 'bidPlaced':
            return `
                <h3>New Bid Placed</h3>
                <p>A new bid of Rs. ${details.bidAmount} has been placed on your product: ${details.productName}.</p>
            `;
        case 'auctionWon':
            return `
                <h3>Congratulations!</h3>
                <p>You have won the auction for the product: ${details.productName} at Rs. ${details.finalPrice}.</p>
            `;
        case 'productBought':
            return `
                <h3>Product Purchased</h3>
                <p>The product: ${details.productName} has been bought by ${details.buyerName} for Rs. ${details.finalPrice}.</p>
            `;
        default:
            return '';
    }
};
