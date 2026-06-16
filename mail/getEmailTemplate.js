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
        case 'emailVerification':
            return `
                <h3>Verify Your Email Address</h3>
                <p>Hi ${details.userName},</p>
                <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
                <p><a href="${details.verificationLink}">Verify Email</a></p>
                <p>This link will expire in 24 hours.</p>
                <p>If you did not create an account, please ignore this email.</p>
            `;
        case 'auctionEndedEarly':
            return `
                <h3>Auction Ended Early</h3>
                <p>The auction for <strong>${details.productName}</strong> has been ended early by an administrator.</p>
                <p><strong>Reason:</strong> ${details.reason}</p>
                <p>We apologize for any inconvenience this may have caused.</p>
            `;
        default:
            return '';
    }
};
