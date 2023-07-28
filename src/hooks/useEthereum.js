import { useState, useEffect } from "react";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { contractABI, contractAddress } from "../constants/contract";

export function useEthereum() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    async function initialize() {
      const ethereumProvider = await detectEthereumProvider();

      if (ethereumProvider) {
        const ethersProvider = new ethers.providers.Web3Provider(
          ethereumProvider
        );
        const signer = ethersProvider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          ethersProvider
        );
        setProvider(ethereumProvider);
        setSigner(signer);
        setContract(contract);
      }
    }

    initialize();
  }, []);

  return { provider, signer, contract };
}
