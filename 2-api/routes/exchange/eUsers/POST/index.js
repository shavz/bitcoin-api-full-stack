'use strict';

const {

    getFormattedEvent,
    getResponse,
    handleError,
    beginningDragonProtection,
    stringify,

} = require( '../../../../utils' );

const addNewUser = require( './addNewUser' );


exports.handler = Object.freeze( async rawEvent => {

    // TODO: on new user add email message id on database user
    
    try {

        console.log( 'running the exchange /exchange-users - POST function' );

        const event = getFormattedEvent({

            rawEvent,
            shouldGetBodyFromEvent: true,
        });

        const {
            
            ipAddress

        } = await beginningDragonProtection({

            queueName: 'exchangeAddNewUser',
            
            event,

            megaCodeIsRequired: false,

            ipAddressMaxRate: 2,
            ipAddressTimeRange: 60000,
        });

        // const userObject = 
        await addNewUser({

            event,
            ipAddress
        });

        const responseData = Object.assign(
            {},
            {
                userAddedSuccessfully: true
            }
        );

        console.log(
            
            'the exchange /exchange-users - ' +
            'POST function executed successfully: ' +
            stringify({ responseData })
        );

        return getResponse({

            body: responseData
        });
    }
    catch( err ) {

        console.log(
            'error in exchange /exchange-users - ' +
            `POST function: ${ err }`
        );

        return handleError( err );
    }
});