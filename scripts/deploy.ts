import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Configuration for Vana Moksha / Mainnet
  const usdcTokenAddress = "0xF1815bd50389c46847f0Bda824eC8da914045D14";
  const treasuryAddress = "0xC1d3007A33d86Fd7390B087304AD3083FC87438C";

  const DataBridgeMarketplace = await ethers.getContractFactory("DataBridgeMarketplace");
  const marketplace = await DataBridgeMarketplace.deploy(usdcTokenAddress, treasuryAddress);

  await marketplace.waitForDeployment();

  const marketplaceAddress = await marketplace.getAddress();
  console.log("DataBridgeMarketplace deployed to:", marketplaceAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
