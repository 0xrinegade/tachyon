# Tachyon

Tachyon is a Solana library for on-chain math. Specifically, it greatly reduces the compute unit cost for evaluating [transcendental functions](https://en.wikipedia.org/wiki/Transcendental_function) (exp, ln, sin, etc).

Unlike normal arithmetic, evaluating transcendental functions can involve computationally costly algorithms behind the scenes (usually Taylor Series approximations, sometimes more optimized like bitshift calculations for log base 2).

Tachyon uses pre-populated [lookup tables](https://en.wikipedia.org/wiki/Lookup_table) combined with [interpolation](https://en.wikipedia.org/wiki/Interpolation) for very accurate function evaluation, and roughly constant compute unit cost.

Tachyon is in the early stages of development, but will soon been deployed on mainnet for public use. Developers may also choose to deploy their own version of Tachyon. Tachyon can also be used to optimize arbitrary use-case specific single-variable functions (if your project has some expensive function that is being called repeatedly).

For implementing Tachyon in your own project, and to see compute unit cost vs. error measurements, please see [this repo](https://gitlab.com/dysonswap/tachyon-test).
