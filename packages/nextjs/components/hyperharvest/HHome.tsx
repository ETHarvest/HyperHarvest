import { COREKIT_STATUS } from '@web3auth/mpc-core-kit';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useWeb3Auth } from '~~/context/Web3Context';
import { getWeb3AuthInstance } from '~~/helpers/web3Auth';

const HHome = () => {
  const { signInWithGoogle } = useWeb3Auth();
  const router = useRouter();

  const checkAndLogin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    try {
      const instance = await getWeb3AuthInstance();

      if (!instance) {
        console.error("Web3Auth instance not found.");
        return;
      }

      if (instance.status === COREKIT_STATUS.LOGGED_IN) {
        router.push('/harvest');
      } else {
        await signInWithGoogle();
      }
    } catch (error) {
      console.error("Error during Web3Auth check:", error);
    }
  };

  return (
    <div className="w-full max-h-screen lg:space-y-14 flex flex-col pt-20 items-center">
     
        <h1 className="lg:text-4xl text-2xl uppercase font-bold mt-0 mb-4">Welcome to HyperHarvest</h1>
        <p className="text-lg lg:max-w-[50%] p-4 text-center">
          Discover the future of cross-chain yield farming with HyperHarvest. 
          Harness the power of AAVE and Chainlink CCIP to optimize your yield and manage assets effortlessly across multiple chains.
        </p>

        <div className="flex flex-row justify-center space-y-0 py-10 lg:py-2 space-x-4">
          <Link href="/about" className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg button lg:uppercase shadow-md hover:bg-gray-400 transition duration-300">
            Learn More
        </Link>
        <button 
          onClick={(e) => checkAndLogin(e)} 
          className="px-6 py-3 bg-teal-600 text-white rounded-lg button lg:uppercase shadow-md hover:bg-teal-700 transition duration-300"
        >
          Start Harvesting
        </button>
        </div>
      <section className="text-center my-28 lg:my-12 px-4">
        <h2 className="text-2xl font-semibold mb-6">Why HyperHarvest?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg card">
            <h3 className="text-xl font-semibold mb-3">Cross-Chain Efficiency</h3>
            <p>Seamlessly move your assets between chains with secure CCIP technology.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg card">
            <h3 className="text-xl font-semibold mb-3">Optimized Yield</h3>
            <p>Maximize your returns with AAVE’s powerful DeFi protocols and custom strategies.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg card">
            <h3 className="text-xl font-semibold mb-3">Safe and Transparent</h3>
            <p>Enjoy peace of mind with our automated smart contracts and advanced security practices.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg card">
            <h3 className="text-xl font-semibold mb-3">User-Friendly Interface</h3>
            <p>Navigate and manage your yield farming effortlessly with our intuitive platform.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HHome;
