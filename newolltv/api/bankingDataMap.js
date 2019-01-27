export default function bankingDataMap(response) {
    return {
        data: {
            transactionId: response.data.transactionId,
            status: response.data.status,
        },
    };
}