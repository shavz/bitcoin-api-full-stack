'use strict';

const {
    utils: {
        doOperationInQueue,
        stringify,
        javascript: {
            getQueueId
        },
    }
} = require( '@npm.m.stecky.efantis/commonprivate' );

const {
    utils: {
        aws: {
            dinoCombos: {
                addTransactionAndUpdateExchangeUser,
                getExchangeUser,
            }
        }
    },
    constants: {
        aws: {
            database: {
                tableNames: {
                    EXCHANGE_USERS
                }
            }
        }
    }
} = require( '@npm.m.stecky.efantis/common-exchange' );

const validateAndGetValues = require( './validateAndGetValues' );
const getAddTransactionValues = require( './getAddTransactionValues' );


module.exports = Object.freeze( async ({

    event,
    exchangeUserId,

}) => {

    const rawType = event.body.type;
    const rawData = event.body.data;

    console.log(
        
        'running doExchange with the following values:',
        stringify({

            rawType,
            rawData
        })
    );

    const {

        type,
        data

    } = validateAndGetValues({

        rawType,
        rawData,
    });

    const doExchangeResponseValues = await doOperationInQueue({

        queueId: getQueueId({ type: EXCHANGE_USERS, id: exchangeUserId }),

        doOperation: async () => {

            const exchangeUser = await getExchangeUser({

                exchangeUserId,
            });

            if( !exchangeUser ) {
                // safeguard: should not get here in normal operation
                throw new Error(
                    'cannot find exchange user: ' +
                    exchangeUserId
                );
            }

            const addTransactionValues = getAddTransactionValues({

                exchangeUserId,
                exchangeUser,
                type,
                data
            });

            await addTransactionAndUpdateExchangeUser( addTransactionValues );

            return {};
        }
    });

    console.log(
        'doExchange executed successfully: ' +
        stringify( doExchangeResponseValues )
    );

    return doExchangeResponseValues;
});