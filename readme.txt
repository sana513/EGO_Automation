npx cucumber-js features/EGO_Features.feature \
  --require features/step-definitions/login.steps.js \
  --require features/support/world.js \
  --require features/support/hooks.js \
  --tags @login      

  npx cucumber-js features/EGO_Features.feature \
  --require features/step-definitions/common.steps.js \
  --require features/step-definitions/signup.steps.js \
  --require features/support/world.js \
  --require features/support/hooks.js \
  --tags @registration

  npx cucumber-js features/EGO_Features.feature \
  --require features/step-definitions/common.steps.js \
  --require features/step-definitions/checkout.steps.js \
  --require features/support/world.js \
  --require features/support/hooks.js \
  --tags @checkout

