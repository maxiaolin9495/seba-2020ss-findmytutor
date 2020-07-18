const verifyRequestBody = (bodyAttributes, req) => {
    for(let i = 0; i < bodyAttributes.length; i++){
        if (!Object.prototype.hasOwnProperty.call(req.body, bodyAttributes[i])) {
            return {
                ifValid: false,
                message: {
                    error: 'Bad Request',
                    message: `The request body must contain a ${bodyAttributes[i]} property`
                }
            };
        }
    }

    return {
        ifValid: true
    }

};

module.exports = {
    verifyRequestBody
};