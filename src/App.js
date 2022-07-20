import './index.css';
import {
  Body,
  Container,
  Header,
  Image,
  Link,
  Button,
} from './components/Styles';
import logo from './assets/logo.png';
import { useEffect, useState } from 'react';
import {
  VStack,
  useDisclosure,
  //Button,
  Text,
  HStack,
  Select,
  Input,
  Box,
} from '@chakra-ui/react';
import SelectWalletModal from './Modal';
import { useWeb3React } from '@web3-react/core';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { Tooltip } from '@chakra-ui/react';
import { networkParams } from './networks';
import { connectors } from './connectors';
import { toHex, truncateAddress } from './utils';
import { darkTheme, lightTheme, Theme, SwapWidget } from '@uniswap/widgets';

const infuraRPC =
  'https://mainnet.infura.io/v3/a7c44e5bd3014e3f95c56d6d6fed0bee';

const myLightTheme: Theme = {
  ...lightTheme, // Extend the lightTheme

  accent: '#338648',
  primary: '#000000',
  secondary: '#565A69',
};

const myDarkTheme: Theme = {
  ...darkTheme, // Extend the darkTheme
  accent: '#338648',
  primary: '#FFFFFF',
  secondary: '#888D9B',
};

let darkMode = true;

export default function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { library, chainId, account, activate, deactivate, active } =
    useWeb3React();
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');
  const [network, setNetwork] = useState(undefined);
  const [message, setMessage] = useState('');
  const [signedMessage, setSignedMessage] = useState('');
  const [verified, setVerified] = useState();
  const nowInfo = (url) => {
    window.open(url, '_self', 'noopener,noreferrer');
  };
  // const Spacer = styled.div(space);

  const handleNetwork = (e) => {
    const id = e.target.value;
    setNetwork(Number(id));
  };

  const handleInput = (e) => {
    const msg = e.target.value;
    setMessage(msg);
  };

  const switchNetwork = async () => {
    try {
      await library.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: toHex(network) }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: 'wallet_addEthereumChain',
            params: [networkParams[toHex(network)]],
          });
        } catch (error) {
          setError(error);
        }
      }
    }
  };

  const signMessage = async () => {
    if (!library) return;
    try {
      const signature = await library.provider.request({
        method: 'personal_sign',
        params: [message, account],
      });
      setSignedMessage(message);
      setSignature(signature);
    } catch (error) {
      setError(error);
    }
  };

  const verifyMessage = async () => {
    if (!library) return;
    try {
      const verify = await library.provider.request({
        method: 'personal_ecRecover',
        params: [signedMessage, signature],
      });
      setVerified(verify === account.toLowerCase());
    } catch (error) {
      setError(error);
    }
  };

  const refreshState = () => {
    window.localStorage.setItem('provider', undefined);
    setNetwork('');
    setMessage('');
    setSignature('');
    setVerified(undefined);
  };

  const disconnect = () => {
    refreshState();
    deactivate();
  };

  useEffect(() => {
    const provider = window.localStorage.getItem('provider');
    if (provider) activate(connectors[provider]);
  }, []);

  return (
    <>
      <Container>
        <Header>
          <HStack>
            <Button onClick={() => nowInfo('https://google.com')}>Home</Button>
            {/* <Spacer mb={4} /> */}
            {!active ? (
              <Button onClick={onOpen}>Connect Wallet</Button>
            ) : (
              <Button onClick={disconnect}>Disconnect</Button>
            )}
          </HStack>
        </Header>
        <Body>
          <Image src={logo} alt="ethereum-logo" />
          <div className="Text">Spread Light - Buy Photons</div>
          <SwapWidget
            provider={library}
            JsonRpcEndpoint={infuraRPC}
            theme={darkMode ? myDarkTheme : myLightTheme}
            //defaultTokenList={MY_TOKEN_LIST}
            defaultOutputTokenAddress={{
              1: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
            }}
            defaultInputAmount={0.5}
            defaultInputTokenAddress={'NATIVE'}
          />
          <br />{' '}
          <Link href="https://rinkeby.etherscan.io/address/0xa8b537633c783f7fdf6f9af8e0a3eae6827c3745#code">
            View Governance on Etherscan
          </Link>
          <div className="Text">Proposal / Voting Page Coming Soon</div>{' '}
          <VStack justifyContent="center" alignItems="center" h="50vh">
            <VStack
              justifyContent="center"
              alignItems="center"
              padding="10px 0"
            >
              <Tooltip label={account} placement="right">
                <Text>{`Account: ${truncateAddress(account)}`}</Text>
              </Tooltip>
              <Text>{`Network ID: ${chainId ? chainId : 'No Network'}`}</Text>
            </VStack>
            {active && (
              <HStack justifyContent="flex-start" alignItems="flex-start">
                <Box
                  maxW="sm"
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  padding="10px"
                >
                  <VStack>
                    <Button onClick={switchNetwork} isDisabled={!network}>
                      Switch Network
                    </Button>
                    <Select
                      placeholder="Select network"
                      onChange={handleNetwork}
                    >
                      <option value="3">Ropsten</option>
                      <option value="4">Rinkeby</option>
                      <option value="42">Kovan</option>
                      <option value="1666600000">Harmony</option>
                      <option value="42220">Celo</option>
                    </Select>
                  </VStack>
                </Box>
                <Box
                  maxW="sm"
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  padding="10px"
                >
                  <VStack>
                    <Button onClick={signMessage} isDisabled={!message}>
                      Sign Message
                    </Button>
                    <Input
                      placeholder="Set Message"
                      maxLength={20}
                      onChange={handleInput}
                      w="140px"
                    />
                    {signature ? (
                      <Tooltip label={signature} placement="bottom">
                        <Text>{`Signature: ${truncateAddress(
                          signature
                        )}`}</Text>
                      </Tooltip>
                    ) : null}
                  </VStack>
                </Box>
                <Box
                  maxW="sm"
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  padding="10px"
                >
                  <VStack>
                    <Button onClick={verifyMessage} isDisabled={!signature}>
                      Verify Message
                    </Button>
                    {verified !== undefined ? (
                      verified === true ? (
                        <VStack>
                          <CheckCircleIcon color="green" />
                          <Text>Signature Verified!</Text>
                        </VStack>
                      ) : (
                        <VStack>
                          <WarningIcon color="red" />
                          <Text>Signature Denied!</Text>
                        </VStack>
                      )
                    ) : null}
                  </VStack>
                </Box>
              </HStack>
            )}
            <Text>{error ? error.message : null}</Text>
          </VStack>
          <SelectWalletModal isOpen={isOpen} closeModal={onClose} />
        </Body>
      </Container>
    </>
  );
}
