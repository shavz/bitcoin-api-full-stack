#!/bin/bash

pushd ../../../../../1-backend/giraffeDeploy/giraffe
npm install
popd

pushd ../../../../../1-backend/giraffeDeploy

if [ "$1" == "--force=true" ]; then

    npm run theomegaSF
else

    npm run theomegaS
fi

popd