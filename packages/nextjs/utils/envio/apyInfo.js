// calculating APY for deposite
export const getAPY = (liquidityRate) => {
    const RAY = 10 ** 27;
    const SECONDS_PER_YEAR = 31536000;
  
    // Assume liquidityRate is fetched from the contract
    let depositAPR = liquidityRate / RAY;
    let depositAPY =
      Math.pow(1 + depositAPR / SECONDS_PER_YEAR, SECONDS_PER_YEAR) - 1;
  
    // Convert to percentage
    depositAPY *= 100;
  
    return depositAPY;
  };
  
  export const getArbAPY = async () => {
    const getReservesResponse = await fetch(
      "https://indexer.bigdevenergy.link/93d433c/v1/graphql",
      {
        method: "POST",
        body: JSON.stringify({
          query: `
          {
            ArbSepoliaUsdcReserve (where: {id: {_eq: "usdc_reserve"}}) {
              id
              liquidityRate
              lastUpdateTimestamp
            }
          }`
        ,
        }),
        cache: "no-cache",
      }
    );
  
    const { data } = await getReservesResponse.json();
  
    console.log("data", data);
    const usdcreserve = data.ArbSepoliaUsdcReserve;
    console.log("usdcreserve", usdcreserve);
  
    const apy = getAPY(usdcreserve[0].liquidityRate);
    return apy.toFixed(3);
  };
  
  export const getOPAPY = async () => {
    const getReservesResponse = await fetch(
      "https://indexer.bigdevenergy.link/93d433c/v1/graphql",
      {
        method: "POST",
        body: JSON.stringify({
          query: `
          {
            OpSepoliaUsdcReserve(where: {id: {_eq: "usdc_reserve"}}) {
              id
              liquidityRate
              lastUpdateTimestamp
            }
          }
          `,
        }),
        cache: "no-cache",
      }
    );
  
    const { data } = await getReservesResponse.json();
  
    console.log("data", data);
    const usdcreserve = data.OpSepoliaUsdcReserve;
    console.log("usdcreserve", usdcreserve);
  
    const apy = getAPY(usdcreserve[0].liquidityRate);
    return apy.toFixed(3);
  };