import fakeMobileUa from "random-mobile-ua";
import { HttpsProxyAgent } from "https-proxy-agent";
import fs from "fs";

async function clicker(token, ua, os, proxy) {
  try {
    const response = await fetch("https://api-gw-tg.memefi.club/graphql", {
      headers: {
        accept: "*/*",
        "accept-language": "vi,vi-VN;q=0.9,en;q=0.8",
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        priority: "u=1, i",
        "sec-ch-ua": ua,
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": os,
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        Referer: "https://tg-app.memefi.club/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: JSON.stringify({
        operationName: "MutationGameProcessTapsBatch",
        variables: {
          payload: {
            nonce:
              "9a43a2447f7a3ddf5aa7b1f8b4bc00e4be489183ede21dc2cf423d56895a9c0e",
            tapsCount: 10,
          },
        },
        query: `mutation MutationGameProcessTapsBatch($payload: TelegramGameTapsBatchInput!) {
        telegramGameProcessTapsBatch(payload: $payload) {
          ...FragmentBossFightConfig
          __typename
        }
        }
        
        fragment FragmentBossFightConfig on TelegramGameConfigOutput {
        _id
        coinsAmount
        currentEnergy
        maxEnergy
        weaponLevel
        energyLimitLevel
        energyRechargeLevel
        tapBotLevel
        currentBoss {
          _id
          level
          currentHealth
          maxHealth
          __typename
        }
        freeBoosts {
          _id
          currentTurboAmount
          maxTurboAmount
          turboLastActivatedAt
          turboAmountLastRechargeDate
          currentRefillEnergyAmount
          maxRefillEnergyAmount
          refillEnergyLastActivatedAt
          refillEnergyAmountLastRechargeDate
          __typename
        }
        bonusLeaderDamageEndAt
        bonusLeaderDamageStartAt
        bonusLeaderDamageMultiplier
        nonce
        __typename
        }`,
      }),
      method: "POST",
      ...{ ...(!!proxy && { agent: proxy }) },
    });

    if (response.ok) {
      const data = await response.json();

      return {
        energy: data.data.telegramGameProcessTapsBatch.currentEnergy,
        refillEnergyAmount:
          data.data.telegramGameProcessTapsBatch.freeBoosts
            .currentRefillEnergyAmount,
        currentTurboAmount:
          data.data.telegramGameProcessTapsBatch.freeBoosts.currentTurboAmount,
      };
    } else {
      throw new Error("Request failed with status: " + response.status);
    }
  } catch (error) {
    console.log("🚀 ~ clicker ~ error:", error);
    throw error;
  }
}

async function energyRecharge(token, ua, os, proxy) {
  try {
    const response = await fetch("https://api-gw-tg.memefi.club/graphql", {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9,vi;q=0.8",
        authorization: `Bearer ${token}`,
        "cache-control": "no-cache",
        "content-type": "application/json",
        pragma: "no-cache",
        priority: "u=1, i",
        "sec-ch-ua": ua,
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": os,
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        Referer: "https://tg-app.memefi.club/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: '{"operationName":"telegramGameActivateBooster","variables":{"boosterType":"Recharge"},"query":"mutation telegramGameActivateBooster($boosterType: BoosterType!) {\\n  telegramGameActivateBooster(boosterType: $boosterType) {\\n    ...FragmentBossFightConfig\\n    __typename\\n  }\\n}\\n\\nfragment FragmentBossFightConfig on TelegramGameConfigOutput {\\n  _id\\n  coinsAmount\\n  currentEnergy\\n  maxEnergy\\n  weaponLevel\\n  energyLimitLevel\\n  energyRechargeLevel\\n  tapBotLevel\\n  currentBoss {\\n    _id\\n    level\\n    currentHealth\\n    maxHealth\\n    __typename\\n  }\\n  freeBoosts {\\n    _id\\n    currentTurboAmount\\n    maxTurboAmount\\n    turboLastActivatedAt\\n    turboAmountLastRechargeDate\\n    currentRefillEnergyAmount\\n    maxRefillEnergyAmount\\n    refillEnergyLastActivatedAt\\n    refillEnergyAmountLastRechargeDate\\n    __typename\\n  }\\n  bonusLeaderDamageEndAt\\n  bonusLeaderDamageStartAt\\n  bonusLeaderDamageMultiplier\\n  nonce\\n  __typename\\n}"}',
      method: "POST",
      ...{ ...(!!proxy && { agent: proxy }) },
    });

    if (response.ok) {
      const data = await response.json();

      return {
        energy: data.data.telegramGameProcessTapsBatch.currentEnergy,
        refillEnergyAmount:
          data.data.telegramGameProcessTapsBatch.freeBoosts
            .currentRefillEnergyAmount,
        currentTurboAmount:
          data.data.telegramGameProcessTapsBatch.freeBoosts.currentTurboAmount,
      };
    } else {
      throw new Error("Request failed with status: " + response.status);
    }
  } catch (error) {
    console.log("🚀 ~ clicker ~ error:", error);
    throw error;
  }
}

const generateAuthorizationWithToken = () => {
  const proxyData = fs.readFileSync("proxy.txt", "utf8");
  const proxyList = proxyData.split("\n").map((line) => line.trim());

  const tokensData = fs.readFileSync("meme.txt", "utf8");
  const authorizationList = tokensData
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  const map = {};
  authorizationList.forEach((token, index) => {
    const currentProxy = !!proxyList[index]
      ? new HttpsProxyAgent(`http://${proxyList[index]}`)
      : null;

    map[index] = {
      token,
      proxy: currentProxy,
      ua: fakeMobileUa.randomApplePhoneAgent(),
    };
  });

  return map;
};

const runTask = async ({ token, proxy, ua }, index) => {
  try {
    let profile = await clicker(token, ua.agent, ua.os, proxy);

    while (profile.energy > 50) {
      profile = await clicker(token, ua.agent, ua.os, proxy);
      console.log(
        "------------------------------------------------------------------------"
      );
      console.log(`Token ${token}:`);
      console.log(profile);
      console.log(
        "------------------------------------------------------------------------"
      );
      if (profile.energy < 50) {
        if (profile.refillEnergyAmount > 0) {
          console.error("-----------🚀 RECHARGE 🚀---------------------");
          profile = await energyRecharge(token, ua.agent, ua.os, proxy);
        } else {
          setTimeout(() => runTask({ token, proxy, ua }, index), 5 * 60 * 1000);
          break;
        }
      }
    }
  } catch (error) {
    console.error(`----------------🚀 Error 🚀---------------------`);
    console.error("-----------🚀 Sleep 10 minutes🚀---------------------");
    setTimeout(() => {
      console.log(`-----------🚀 Token ${token} is run again ----------`);
      runTask({ token, proxy, ua }, index);
    }, 5 * 60 * 1000);
  }
};

const startProcessingTokens = async () => {
  const authorizationList = generateAuthorizationWithToken();
  await Promise.all(
    Object.keys(authorizationList).map(
      async (key, index) => await runTask(authorizationList[key], index)
    )
  );
};

startProcessingTokens();

setInterval(startProcessingTokens, 5 * 60 * 1000);
