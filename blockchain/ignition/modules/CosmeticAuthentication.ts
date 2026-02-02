import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CosmeticAuthenticationModule", (m) => {
  const counter = m.contract("CosmeticAuthentication");


  return { counter };
});
