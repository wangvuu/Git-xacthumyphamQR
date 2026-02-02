import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MywalletModule", (m) => {
  const counter = m.contract("Mywallet");
  return { counter };
});
