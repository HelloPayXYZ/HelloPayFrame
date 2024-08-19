import { Button, Frog, TextInput, parseEther } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/vercel'
import { Box, vars, Image } from './ui.js'
import { Web3 } from 'web3'
import { Address } from 'viem';

import { getUserInfo, getRedPackageInfo, getUserClaimedInfo, getTop3Account } from './utils.js'
import { abi } from './abi.js'

const factoryAddr = "0x1a65BBbc5f29588919823F20f48369C977DD95e0"
const zeroAddr = "0x0000000000000000000000000000000000000000"
const defaultFid = '500326'
const vercelURL = "https://hello-pay-mvp.vercel.app"

const web3 = new Web3('https://polygon.llamarpc.com');

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

type State = {
    index: string,
    type: string,
    pfpURL: string,
    name: string,
    symbol: string,
    totalAmount: string,
    totalNumber: string,
    remainAmount: string,
    remainNumber: string,
    memo: string,
    accounts: [],

    newType: string,
    newTokenAddr: string,
    newAmount: string,
    newNumber: string,
    newMemo: string,
    claimTXHash: string,
    approveTXHash: string,
    createTXHash: string,
}

export const app = new Frog<{ State: State }>({
    ui: { vars },
    title: "HelloPay",
    assetsPath: '/',
    basePath: '/api',
    initialState: {
        index: '',
        type: '',
        pfpURL: '',
        name: '',
        symbol: '',
        totalAmount: '',
        totalNumber: '',
        remainAmount: '',
        remainNumber: '',
        memo: '',
        accounts: [],

        newType: '',
        newTokenAddr: '',
        newAmount: '',
        newNumber: '',
        newMemo: '',
        claimTXHash: '',
        approveTXHash: '',
        createTXHash: ''
    }
    // Supply a Hub to enable frame verification.
    // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

app.frame('/:redPackageIndex', async (c) => {
    const redPackageIndex = c.req.param("redPackageIndex")
    const { deriveState } = c
    let info: any
    let response: any

    try {
        info = await getRedPackageInfo(redPackageIndex);
        response = await getUserInfo(info?.fid ?? defaultFid);
        console.log(info)
        const state = await deriveState(previousState => {
            previousState.index = redPackageIndex
            previousState.type = info?.rpType ?? ''
            previousState.pfpURL = response?.pfp_url ?? ''
            previousState.name = response?.display_name ?? ''
            previousState.symbol = info?.symbol ?? ''
            previousState.totalAmount = info?.totalAmount ?? ''
            previousState.totalNumber = info?.totalNumber ?? ''
            previousState.remainAmount = info?.remainAmount ?? ''
            previousState.remainNumber = info?.remainNumber ?? ''
            previousState.memo = info?.memo ?? ''
            previousState.accounts = info?.accounts ?? []
        })
        console.log(state)
    } catch (error) {
        console.log(error)
    }

    return c.res({
        image: (
            <Box fontFamily="default">
                <div tw="flex flex-col w-full h-full">
                    <img
                        style={{ objectFit: "cover" }}
                        tw="absolute inset-0 w-full h-full flex"
                        src="/red1.png"
                    />
                    <div tw="flex justify-center items-center mt-52 mb-7 text-3xl">
                        <div tw="pr-2">
                            Send by
                        </div>
                        <Image
                            borderRadius="48"
                            height="48"
                            width="48"
                            src={response.pfp_url}
                        />
                        <div tw="pl-2">
                            {response.display_name}
                        </div>
                    </div>

                    <div tw="flex flex-col w-full h-42 bg-yellow-50 opacity-70 text-xl px-10 ">
                        <div tw="flex justify-center my-2">
                            {info?.rpType}
                        </div>
                        <div tw="flex justify-between py-2 w-full">
                            <div>
                                Total Balance:
                            </div>
                            <div tw="flex">
                                {(parseInt(info?.totalAmount ?? '0') / 1e18).toString()} {info?.symbol}
                            </div>
                        </div>
                        <div tw="flex justify-between py-2 w-full">
                            <div>
                                Remain Chance:
                            </div>
                            <div tw="flex">
                                {info?.remainNumber}/{info?.totalNumber}
                            </div>
                        </div>
                        <div tw="flex justify-between py-2 w-full">
                            <div>
                                Remain Balance:
                            </div>
                            <div tw="flex">
                                {(parseFloat(info?.remainAmount ?? '0') / 1e18).toFixed(4)} {info?.symbol}
                            </div>
                        </div>
                    </div>
                    <div tw="flex justify-center mt-8 text-3xl">{info?.memo}</div>
                </div>
            </Box>
        ),
        imageAspectRatio: "1:1",
        imageOptions: {
            width: 600,
            height: 600
        },
        intents: [
            // <TextInput placeholder="Enter custom fruit..1." />,
            <Button action={`/${redPackageIndex}/openRedPackage`}>🧧 Open Red Packet</Button>,
            <Button action={`/${redPackageIndex}/sendRedPackage`}>🧧 Send Another Red Packet</Button>,
            <Button action={`/${redPackageIndex}/checkDetails`}>🔍 Check Details</Button>,
            <Button.Link href="https://hellopay.xyz/">🪂 Join $HP Airdrop 1</Button.Link>,
            // status === 'response' && <Button.Reset>Reset</Button.Reset>,
        ],
    })
})


// app.hono.get('/image/:url', async (c) => {

//   const url = c.req.param('url');
//   const pic_url = decodeURIComponent(url)
//   const response = await fetch(pic_url)
//   c.status(response.status as StatusCode)
//   c.header('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream')
//   return c.body(response.body);
// });

// OpenRedPackage

app.frame('/:redPackageIndex/openRedPackage', async (c) => {
    const redPackageIndex = c.req.param("redPackageIndex")
    const { frameData, deriveState } = c

    let info: any
    let response: any
    let state: any
    try {
        info = await getRedPackageInfo(redPackageIndex);
        response = await getUserInfo(info?.fid ?? defaultFid);
        state = await deriveState(previousState => {
            previousState.index = redPackageIndex
            previousState.type = info?.rpType ?? ''
            previousState.pfpURL = response?.pfp_url ?? ''
            previousState.name = response?.display_name ?? ''
            previousState.symbol = info?.symbol ?? ''
            previousState.totalAmount = info?.totalAmount ?? ''
            previousState.totalNumber = info?.totalNumber ?? ''
            previousState.remainAmount = info?.remainAmount ?? ''
            previousState.remainNumber = info?.remainNumber ?? ''
            previousState.memo = info?.memo ?? ''
            previousState.accounts = info?.accounts ?? []
        })
    } catch (error) {
        console.log(error)
    }

    const result = await getUserClaimedInfo(frameData?.fid.toString() ?? defaultFid, redPackageIndex)
    const isNotClaimed = result?.claimAmount

    return c.res({
        image: (
            !isNotClaimed ? <Box fontFamily="default">
                <div tw="flex flex-col w-full h-full">
                    <img
                        style={{ objectFit: "cover" }}
                        tw="absolute inset-0 w-full h-full flex"
                        src="/red1.png"
                    />
                    <div tw="flex w-full justify-center items-center mt-52 mb-7 text-3xl">
                        <div tw="pr-2">
                            Send by
                        </div>
                        <Image
                            borderRadius="48"
                            height="48"
                            width="48"
                            src={state.pfpURL}
                        />
                        <div tw="pl-2">
                            {state.name}
                        </div>
                    </div>
                    <div tw="flex w-full h-1/4 justify-center items-center text-xl">
                        <div tw="flex bg-yellow-50 rounded-md border-4 border-solid border-violet-700 w-5/6 opacity-70 justify-center items-center py-5">
                            You can claim this red Package, good luck to you!
                        </div>
                    </div>
                    <div tw="flex justify-center mt-8 text-3xl">{state.memo}</div>
                </div>
            </Box> : <Box fontFamily="default">
                <div tw="flex flex-col w-full h-full">
                    <img
                        style={{ objectFit: "cover" }}
                        tw="absolute inset-0 w-full h-full flex"
                        src="/red1.png"
                    />
                    <div tw="flex w-full justify-center items-center mt-52 mb-7 text-3xl">
                        <div tw="pr-2">
                            Send by
                        </div>
                        <Image
                            borderRadius="48"
                            height="48"
                            width="48"
                            src={state.pfpURL}
                        />
                        <div tw="pl-2">
                            {state.name}
                        </div>
                    </div>
                    <div tw="flex w-full h-1/4 justify-center items-center text-xl">
                        <div tw="flex bg-yellow-50 rounded-md border-4 border-solid border-violet-700 w-5/6 opacity-70 justify-center items-center py-5 text-center">
                            You have claimed this red package, try to find some new red package!
                        </div>
                    </div>
                    <div tw="flex justify-center mt-8 text-3xl">{state.memo}</div>
                </div>
            </Box>
        ),
        imageAspectRatio: "1:1",
        imageOptions: {
            width: 600,
            height: 600
        },
        intents: [
            !isNotClaimed && <Button.Transaction target="/openRedPackage/open" action={`/${redPackageIndex}/openRedPackage/openResult`}>🧧 Open Red Packet onchain</Button.Transaction>,
            <Button action={`/${redPackageIndex}`}>⬅️ Back</Button>
        ],
    })
})

app.frame('/:redPackageIndex/openRedPackage/openResult', async (c) => {
    const redPackageIndex = c.req.param("redPackageIndex")
    const { transactionId, deriveState } = c
    const state = deriveState(previousStates => {
        if (transactionId) {
            previousStates.claimTXHash = transactionId
        }
    })
    let isPending = true
    let claimedAmount = ''

    try {
        const txLog = await web3.eth.getTransactionReceipt(state.claimTXHash as Address)

        const txResult = web3.eth.abi.decodeLog([
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "contract IERC20",
                "name": "_token",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_claimAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_fid",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_account",
                "type": "address"
            }
        ], txLog.logs[txLog.logs.length - 1].data ?? "", txLog.logs[txLog.logs.length - 1].topics ?? [])

        isPending = false
        claimedAmount = txResult._claimAmount as string
    } catch (error) {
        console.log("tx pending")
        console.log(error)
    }


    return c.res({
        image: (
            !isPending ? <Box fontFamily="default">
                <div tw="flex flex-col w-full h-full">
                    <img
                        style={{ objectFit: "cover" }}
                        tw="absolute inset-0 w-full h-full flex"
                        src="/red1.png"
                    />
                    <div tw="flex w-full justify-center items-center mt-52 mb-7 text-3xl">
                        <div tw="pr-2">
                            Send by
                        </div>
                        <Image
                            borderRadius="48"
                            height="48"
                            width="48"
                            src={state.pfpURL}
                        />
                        <div tw="pl-2">
                            {state.name}
                        </div>
                    </div>
                    <div tw="flex w-full h-1/4 justify-center items-center text-xl">
                        <div tw="flex bg-yellow-50 rounded-md border-4 border-solid border-violet-700 w-5/6 opacity-70 justify-center items-center py-5 text-center">
                            Congratulations, you claimed {(parseFloat(claimedAmount) / 1e18).toFixed(4)} {state.symbol}!
                        </div>
                    </div>
                    <div tw="flex justify-center mt-8 text-3xl">{state.memo}</div>
                </div>
            </Box> : <Box fontFamily="default">
                <div tw="flex flex-col w-full h-full">
                    <img
                        style={{ objectFit: "cover" }}
                        tw="absolute inset-0 w-full h-full flex"
                        src="/red1.png"
                    />
                    <div tw="flex w-full justify-center items-center mt-52 mb-7 text-3xl">
                        <div tw="pr-2">
                            Send by
                        </div>
                        <Image
                            borderRadius="48"
                            height="48"
                            width="48"
                            src={state.pfpURL}
                        />
                        <div tw="pl-2">
                            {state.name}
                        </div>
                    </div>
                    <div tw="flex w-full h-1/4 justify-center items-center text-xl">
                        <div tw="flex bg-yellow-50 rounded-md border-4 border-solid border-violet-700 w-5/6 opacity-70 justify-center items-center py-5 text-center">
                            Click Check TX Status Button to get transaction result.
                        </div>
                    </div>
                    <div tw="flex justify-center mt-8 text-3xl">{state.memo}</div>
                </div>
            </Box>
        ),
        imageAspectRatio: "1:1",
        imageOptions: {
            width: 600,
            height: 600
        },
        intents: [
            isPending && <Button action={`/${redPackageIndex}/openRedPackage/openResult`}>Check TX Status</Button>,
            <Button action={`/${redPackageIndex}`}>⬅️ Back</Button>
        ],
    })
})

app.transaction('/openRedPackage/open', async (c) => {
    const { previousState, frameData } = c
    // Contract transaction response.
    return c.contract({
        abi,
        chainId: 'eip155:137',
        functionName: 'claimRedPackage',
        args: [BigInt(frameData?.fid ?? defaultFid), BigInt(previousState.index)],
        to: factoryAddr,
    })
})

//SendRedPackage

app.frame('/:redPackageIndex/sendRedPackage', async (c) => {
    const redPackageIndex = c.req.param("redPackageIndex")
    const { deriveState } = c
    let info: any
    let response: any
    let state: any
    try {
        info = await getRedPackageInfo(redPackageIndex);
        response = await getUserInfo(info?.fid ?? defaultFid);
        console.log(info)
        state = await deriveState(previousState => {
            previousState.index = redPackageIndex
            previousState.type = info?.rpType ?? ''
            previousState.pfpURL = response?.pfp_url ?? ''
            previousState.name = response?.display_name ?? ''
            previousState.symbol = info?.symbol ?? ''
            previousState.totalAmount = info?.totalAmount ?? ''
            previousState.totalNumber = info?.totalNumber ?? ''
            previousState.remainAmount = info?.remainAmount ?? ''
            previousState.remainNumber = info?.remainNumber ?? ''
            previousState.memo = info?.memo ?? ''
            previousState.accounts = info?.accounts ?? []
        })
        console.log(state)
    } catch (error) {
        console.log(error)
    }

    return c.res({
        action: `/${redPackageIndex}/sendRedPackage/step2`,
        image: (
            <Box fontFamily="default">
                <div tw="flex flex-col w-full h-full">
                    <img
                        style={{ objectFit: "cover" }}
                        tw="absolute inset-0 w-full h-full flex"
                        src="/red2.png"
                    />
                    <div tw="flex flex-col justify-center items-center w-full bg-yellow-50 opacity-70 mt-34 py-5 text-xl">
                        <div tw="flex p-2 rounded-full border-4 border-solid border-violet-700 ">
                            Step 1. Select the Red Package type
                        </div>
                        <div tw="flex p-2">
                            Step 2. Select the token
                        </div>
                        <div tw="flex p-2">
                            Step 3. Set the red package’s balance
                        </div>
                        <div tw="flex p-2">
                            Step 4. Set the red package’s Chance
                        </div>
                        <div tw="flex p-2">
                            Step 5. Set the red package’s memo
                        </div>
                        <div tw="flex p-2">
                            Step 6. Approve the token spend
                        </div>
                        <div tw="flex p-2">
                            Step 7. Send the red package
                        </div>
                    </div>
                </div>
            </Box>
        ),
        imageAspectRatio: "1:1",
        imageOptions: {
            width: 600,
            height: 600
        },
        intents: [
            // <TextInput placeholder="Enter custom fruit..." />,
            <Button value="0">Lucky Money Red Package</Button>,
            <Button value="1">Common Red Package</Button>,
            // <Button value="bananas">Exclusive Red Package</Button>,
            <Button action={`/${redPackageIndex}`}>⬅️ Back</Button>
        ],
    })
})

app.frame('/:redPackageIndex/sendRedPackage/step2', async (c) => {
    const redPackageIndex = c.req.param("redPackageIndex")
    const { buttonValue, deriveState } = c
    deriveState(previousState => {
        previousState.newType = buttonValue ? buttonValue : '1'
    })

    return c.res({
        action: `/${redPackageIndex}/sendRedPackage/step3`,
        image: (
            <Box fontFamily="default">
                <div tw="flex flex-col w-full h-full">
                    <img
                        style={{ objectFit: "cover" }}
                        tw="absolute inset-0 w-full h-full flex"
                        src="/red2.png"
                    />
                    <div tw="flex flex-col justify-center items-center w-full bg-yellow-50 opacity-70 mt-34 py-5 text-xl">
                        <div tw="flex p-2">
                            Step 1. Select the Red Package type
                        </div>
                        <div tw="flex p-2 rounded-full border-4 border-solid border-violet-700 ">
                            Step 2. Select the token
                        </div>
                        <div tw="flex p-2">
                            Step 3. Set the red package’s balance
                        </div>
                        <div tw="flex p-2">
                            Step 4. Set the red package’s Chance
                        </div>
                        <div tw="flex p-2">
                            Step 5. Set the red package’s memo
                        </div>
                        <div tw="flex p-2">
                            Step 6. Approve the token spend
                        </div>
                        <div tw="flex p-2">
                            Step 7. Send the red package
                        </div>
                    </div>
                </div>
            </Box>
        ),
        imageAspectRatio: "1:1",
        imageOptions: {
            width: 600,
            height: 600
        },
        intents: [
            <TextInput placeholder="Input target token address." />,
            <Button value={zeroAddr}>$MATIC</Button>,
            <Button value="custom">➡️ Next Step</Button>,
            // <Button value="bananas">Exclusive Red Package</Button>,
            <Button action={`/${redPackageIndex}`}>⬅️ Back</Button>
        ],
    })
})

app.frame('/:redPackageIndex/sendRedPackage/step3', async (c) => {
    const redPackageIndex = c.req.param("redPackageIndex")
    const { buttonValue, inputText, deriveState } = c
    deriveState(previousState => {
        if (buttonValue === "custom") {
            previousState.newTokenAddr = inputText ? inputText : ''
        } else {
            previousState.newTokenAddr = buttonValue ? buttonValue : zeroAddr
        }
    })

    return c.res({
        action: `/${redPackageIndex}/sendRedPackage/step4`,
        image: (
            <Box fontFamily="default">
                <div tw="flex flex-col w-full h-full">
                    <img
                        style={{ objectFit: "cover" }}
                        tw="absolute inset-0 w-full h-full flex"
                        src="/red2.png"
                    />
                    <div tw="flex flex-col justify-center items-center w-full bg-yellow-50 opacity-70 mt-34 py-5 text-xl">
                        <div tw="flex p-2 ">
                            Step 1. Select the Red Package type
                        </div>
                        <div tw="flex p-2">
                            Step 2. Select the token
                        </div>
                        <div tw="flex p-2 rounded-full border-4 border-solid border-violet-700">
                            Step 3. Set the red package’s balance
                        </div>
                        <div tw="flex p-2">
                            Step 4. Set the red package’s Chance
                        </div>
                        <div tw="flex p-2">
                            Step 5. Set the red package’s memo
                        </div>
                        <div tw="flex p-2">
                            Step 6. Approve the token spend
                        </div>
                        <div tw="flex p-2">
                            Step 7. Send the red package
                        </div>
                    </div>
                </div>
            </Box>
        ),
        imageAspectRatio: "1:1",
        imageOptions: {
            width: 600,
            height: 600
        },
        intents: [
            <TextInput placeholder="Input red package balance." />,
            <Button value="100">$100</Button>,
            <Button value="10000">$10,000</Button>,
            <Button value="custom">➡️ Next Step</Button>,
            // <Button value="bananas">Exclusive Red Package</Button>,
            <Button action={`/${redPackageIndex}`}>⬅️ Back</Button>
        ],
    })
})

app.frame('/:redPackageIndex/sendRedPackage/step4', async (c) => {
    const redPackageIndex = c.req.param("redPackageIndex")
    const { buttonValue, inputText, deriveState } = c
    deriveState(previousState => {
        if (buttonValue === "custom") {
            previousState.newAmount = inputText ? inputText : '0'
        } else {
            previousState.newAmount = buttonValue ? buttonValue : '0'
        }
    })

    return c.res({
        action: `/${redPackageIndex}/sendRedPackage/step5`,
        image: (
            <Box fontFamily="default">
                <div tw="flex flex-col w-full h-full">
                    <img
                        style={{ objectFit: "cover" }}
                        tw="absolute inset-0 w-full h-full flex"
                        src="/red2.png"
                    />
                    <div tw="flex flex-col justify-center items-center w-full bg-yellow-50 opacity-70 mt-34 py-5 text-xl">
                        <div tw="flex p-2">
                            Step 1. Select the Red Package type
                        </div>
                        <div tw="flex p-2">
                            Step 2. Select the token
                        </div>
                        <div tw="flex p-2">
                            Step 3. Set the red package’s balance
                        </div>
                        <div tw="flex p-2 rounded-full border-4 border-solid border-violet-700 ">
                            Step 4. Set the red package’s Chance
                        </div>
                        <div tw="flex p-2">
                            Step 5. Set the red package’s memo
                        </div>
                        <div tw="flex p-2">
                            Step 6. Approve the token spend
                        </div>
                        <div tw="flex p-2">
                            Step 7. Send the red package
                        </div>
                    </div>
                </div>
            </Box>
        ),
        imageAspectRatio: "1:1",
        imageOptions: {
            width: 600,
            height: 600
        },
        intents: [
            <TextInput placeholder="Input red package chance." />,
            <Button value="20">20</Button>,
            <Button value="100">100</Button>,
            <Button value="custom">➡️ Next Step</Button>,
            // <Button value="bananas">Exclusive Red Package</Button>,
            <Button action={`/${redPackageIndex}`}>⬅️ Back</Button>
        ],
    })
})

app.frame('/:redPackageIndex/sendRedPackage/step5', async (c) => {
    const redPackageIndex = c.req.param("redPackageIndex")
    const { buttonValue, inputText, deriveState } = c
    deriveState(previousState => {
        if (buttonValue === "custom") {
            previousState.newNumber = inputText ? inputText : '0'
        } else {
            previousState.newNumber = buttonValue ? buttonValue : '0'
        }
    })
    return c.res({
        action: `/${redPackageIndex}/sendRedPackage/step6`,
        image: (
            <Box fontFamily="default">
                <div tw="flex flex-col w-full h-full">
                    <img
                        style={{ objectFit: "cover" }}
                        tw="absolute inset-0 w-full h-full flex"
                        src="/red2.png"
                    />
                    <div tw="flex flex-col justify-center items-center w-full bg-yellow-50 opacity-70 mt-34 py-5 text-xl">
                        <div tw="flex p-2">
                            Step 1. Select the Red Package type
                        </div>
                        <div tw="flex p-2">
                            Step 2. Select the token
                        </div>
                        <div tw="flex p-2">
                            Step 3. Set the red package’s balance
                        </div>
                        <div tw="flex p-2">
                            Step 4. Set the red package’s Chance
                        </div>
                        <div tw="flex p-2 rounded-full border-4 border-solid border-violet-700 ">
                            Step 5. Set the red package’s memo
                        </div>
                        <div tw="flex p-2">
                            Step 6. Approve the token spend
                        </div>
                        <div tw="flex p-2">
                            Step 7. Send the red package
                        </div>
                    </div>
                </div>
            </Box>
        ),
        imageAspectRatio: "1:1",
        imageOptions: {
            width: 600,
            height: 600
        },
        intents: [
            <TextInput placeholder="Input memo..." />,
            <Button>➡️ Next Step</Button>,
            <Button action={`/${redPackageIndex}`}>⬅️ Back</Button>
        ],
    })
})

app.frame('/:redPackageIndex/sendRedPackage/step6', async (c) => {
    const redPackageIndex = c.req.param("redPackageIndex")
    const { inputText, deriveState } = c
    const state = deriveState(previousState => {
        previousState.newMemo = inputText ? inputText : ''
    })
    return c.res({
        action: `/${redPackageIndex}/sendRedPackage/step7`,
        image: (
            <Box fontFamily="default">
                <div tw="flex flex-col w-full h-full">
                    <img
                        style={{ objectFit: "cover" }}
                        tw="absolute inset-0 w-full h-full flex"
                        src="/red2.png"
                    />
                    <div tw="flex flex-col justify-center items-center w-full bg-yellow-50 opacity-70 mt-34 py-5 text-xl">
                        <div tw="flex p-2">
                            Step 1. Select the Red Package type
                        </div>
                        <div tw="flex p-2">
                            Step 2. Select the token
                        </div>
                        <div tw="flex p-2">
                            Step 3. Set the red package’s balance
                        </div>
                        <div tw="flex p-2">
                            Step 4. Set the red package’s Chance
                        </div>
                        <div tw="flex p-2">
                            Step 5. Set the red package’s memo
                        </div>
                        <div tw="flex p-2 rounded-full border-4 border-solid border-violet-700 ">
                            Step 6. Approve the token spend
                        </div>
                        <div tw="flex p-2">
                            Step 7. Send the red package
                        </div>
                    </div>
                </div>
            </Box>
        ),
        imageAspectRatio: "1:1",
        imageOptions: {
            width: 600,
            height: 600
        },
        intents: [
            state.newTokenAddr !== zeroAddr && <Button.Transaction target="/sendRedPackage/approve">➡️ Approve this spend</Button.Transaction>,
            <Button>➡️ Next Step</Button>,
            // <Button value="bananas">Exclusive Red Package</Button>,
            <Button action={`/${redPackageIndex}`}>⬅️ Back</Button>
        ],
    })
})

app.frame('/:redPackageIndex/sendRedPackage/step7', async (c) => {
    const redPackageIndex = c.req.param("redPackageIndex")
    const { transactionId, deriveState } = c
    let isPending = true

    const state = deriveState(previousStates => {
        if (transactionId) {
            previousStates.approveTXHash = transactionId
        }
    })

    try {
        if (state.approveTXHash) {
            const txLog = await web3.eth.getTransactionReceipt(state.approveTXHash as Address)

            const txResult = web3.eth.abi.decodeLog([
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ], txLog.logs[0].data ?? "", txLog.logs[0].topics ?? [])
        }

        isPending = false
    } catch (error) {
        console.log("tx pending")
        console.log(error)
    }


    return c.res({
        image: (
            <Box fontFamily="default">
                <div tw="flex flex-col w-full h-full">
                    <img
                        style={{ objectFit: "cover" }}
                        tw="absolute inset-0 w-full h-full flex"
                        src="/red2.png"
                    />
                    <div tw="flex flex-col justify-center items-center w-full bg-yellow-50 opacity-70 mt-34 py-5 text-xl">
                        <div tw="flex p-2">
                            Step 1. Select the Red Package type
                        </div>
                        <div tw="flex p-2">
                            Step 2. Select the token
                        </div>
                        <div tw="flex p-2">
                            Step 3. Set the red package’s balance
                        </div>
                        <div tw="flex p-2">
                            Step 4. Set the red package’s Chance
                        </div>
                        <div tw="flex p-2">
                            Step 5. Set the red package’s memo
                        </div>
                        <div tw="flex p-2">
                            Step 6. Approve the token spend
                        </div>
                        <div tw="flex p-2 rounded-full border-4 border-solid border-violet-700 ">
                            Step 7. Send the red package
                        </div>
                    </div>
                </div>
            </Box>
        ),
        imageAspectRatio: "1:1",
        imageOptions: {
            width: 600,
            height: 600
        },
        intents: [
            isPending && <Button action={`/${redPackageIndex}/sendRedPackage/step7`}>Check TX Status</Button>,
            // <Button value="bananas">Exclusive Red Package</Button>,
            !isPending && <Button.Transaction target="/sendRedPackage/send" action={`/${redPackageIndex}/sendRedPackage/success`}>➡️ Send the red package</Button.Transaction>,
            <Button action={`/${redPackageIndex}`}>⬅️ Back</Button>
        ],
    })
})

app.frame('/:redPackageIndex/sendRedPackage/success', async (c) => {
    const redPackageIndex = c.req.param("redPackageIndex")
    const { deriveState, frameData, transactionId } = c
    let response = await getUserInfo(frameData?.fid.toString() ?? defaultFid)

    let isPending = true
    let newIndex: string = ''

    const state = deriveState(previousStates => {
        if (transactionId) {
            previousStates.createTXHash = transactionId
        }
    })
    try {
        const txLog = await web3.eth.getTransactionReceipt(state.createTXHash as `0x${string}`)

        const txResult = web3.eth.abi.decodeLog([
            {
                "indexed": false,
                internalType: "uint256",
                name: "index",
                type: "uint256"
            },
            {
                "indexed": false,
                internalType: "enum HelloPayRedPackageFactory.RedPackageType",
                name: "_redPackgeType",
                type: "uint8"
            },
            {
                "indexed": false,
                internalType: "contract IERC20",
                name: "_token",
                type: "address"
            },
            {
                "indexed": false,
                internalType: "uint256",
                name: "_totalAmount",
                type: "uint256"
            },
            {
                "indexed": false,
                internalType: "uint256",
                name: "_totalNumber",
                type: "uint256"
            },
            {
                "indexed": false,
                internalType: "uint256",
                name: "_fid",
                type: "uint256"
            },
            {
                "indexed": false,
                internalType: "address",
                name: "_account",
                type: "address"
            },
            {
                "indexed": false,
                internalType: "string",
                name: "_memo",
                type: "string"
            }
        ], txLog.logs[txLog.logs.length - 1].data ?? "", txLog.logs[txLog.logs.length - 1].topics ?? [])

        isPending = false
        newIndex = txResult.index as string
    } catch (error) {
        console.log("tx pending")
        console.log(error)
    }

    return c.res({
        image: (
            !isPending ? <Box fontFamily="default">
                <div tw="flex flex-col w-full h-full">
                    <img
                        style={{ objectFit: "cover" }}
                        tw="absolute inset-0 w-full h-full flex"
                        src="/red1.png"
                    />
                    <div tw="flex w-full justify-center items-center mt-52 mb-7 text-3xl">
                        <div tw="pr-2">
                            Send by
                        </div>
                        <Image
                            borderRadius="48"
                            height="48"
                            width="48"
                            src={response.pfp_url}
                        />
                        <div tw="pl-2">
                            {response.display_name}
                        </div>
                    </div>
                    <div tw="flex w-full h-1/4 justify-center items-center text-xl">
                        <div tw="flex flex-col bg-yellow-50 rounded-md border-4 border-solid border-violet-700 w-5/6 opacity-70">
                            <div tw="flex flex-col justify-center items-center px-10 py-2 w-ful text-center">
                                <div>
                                    Send Red Package Succeed! Share to let more followers know
                                </div>
                            </div>
                        </div>
                    </div>
                    <div tw="flex w-full justify-center h-1/6 items-center" style={{ fontSize: 30, fontWeight: 700, color: '#000' }}>{state.newMemo}</div>
                </div>
            </Box> : <Box fontFamily="default">
                <div tw="flex flex-col w-full h-full">
                    <img
                        style={{ objectFit: "cover" }}
                        tw="absolute inset-0 w-full h-full flex"
                        src="/red1.png"
                    />
                    <div tw="flex w-full justify-center items-center mt-52 mb-7 text-3xl">
                        
                    </div>
                    <div tw="flex w-full h-1/4 justify-center items-center text-xl">
                        <div tw="flex flex-col bg-yellow-50 rounded-md border-4 border-solid border-violet-700 w-5/6 opacity-70">
                            <div tw="flex flex-col justify-center items-center px-10 py-2 w-full text-center">
                                <div>
                                    Click the Check TX Status Button to get the transaction's result.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div tw="flex w-full justify-center h-1/6 items-center" style={{ fontSize: 30, fontWeight: 700, color: '#000' }}>{state.newMemo}</div>
                </div>
            </Box>
        ),
        imageAspectRatio: "1:1",
        imageOptions: {
            width: 600,
            height: 600
        },
        intents: [
            isPending && <Button action={`/${redPackageIndex}/sendRedPackage/success`}>Check TX Status</Button>,
            !isPending && <Button.Link href={`https://warpcast.com/~/compose?text=I%20just%20sent%20a%20red%20package%2C%20come%20and%20open%20it%20to%20get%20the%20token!&embeds%5B%5D=${vercelURL}/api/${newIndex}`}>
                Share The Red Package
            </Button.Link>,
            // <Button value="bananas">Exclusive Red Package</Button>,
            <Button action={`/${redPackageIndex}`}>⬅️ Back</Button>
        ],
    })
})

app.transaction('/sendRedPackage/approve', async (c) => {
    const { previousState } = c
    // Contract transaction response.
    return c.contract({
        abi,
        chainId: 'eip155:137',
        functionName: 'approve',
        args: [factoryAddr, parseEther(previousState.newAmount)],
        to: previousState.newTokenAddr as Address,
    })
})

app.transaction('/sendRedPackage/send', async (c) => {
    const { previousState, frameData } = c
    // Contract transaction response.
    console.log(previousState)

    if (previousState.newTokenAddr == zeroAddr) {
        return c.contract({
            abi,
            chainId: 'eip155:137',
            functionName: 'sendRedPackage',
            args: [parseInt(previousState.newType), previousState.newTokenAddr as Address, parseEther(previousState.newAmount), BigInt(previousState.newNumber), BigInt(frameData?.fid ?? defaultFid), previousState.newMemo],
            to: factoryAddr,
            value: parseEther(previousState.newAmount)
        })
    } else { 
        return c.contract({
            abi,
            chainId: 'eip155:137',
            functionName: 'sendRedPackage',
            args: [parseInt(previousState.newType), previousState.newTokenAddr as Address, parseEther(previousState.newAmount), BigInt(previousState.newNumber), BigInt(frameData?.fid ?? defaultFid), previousState.newMemo],
            to: factoryAddr,
        })
    } 
})

//CheckDetails

app.frame('/:redPackageIndex/checkDetails', async (c) => {
    const redPackageIndex = c.req.param("redPackageIndex")
    const { deriveState } = c
    let info: any
    let response: any
    let state: any
    try {
        info = await getRedPackageInfo(redPackageIndex);
        response = await getUserInfo(info?.fid ?? defaultFid);
        console.log(info)
        state = await deriveState(previousState => {
            previousState.index = redPackageIndex
            previousState.type = info?.rpType ?? ''
            previousState.pfpURL = response?.pfp_url ?? ''
            previousState.name = response?.display_name ?? ''
            previousState.symbol = info?.symbol ?? ''
            previousState.totalAmount = info?.totalAmount ?? ''
            previousState.totalNumber = info?.totalNumber ?? ''
            previousState.remainAmount = info?.remainAmount ?? ''
            previousState.remainNumber = info?.remainNumber ?? ''
            previousState.memo = info?.memo ?? ''
            previousState.accounts = info?.accounts ?? []
        })
        console.log(state)
    } catch (error) {
        console.log(error)
    }

    const top3Account = await getTop3Account(state.accounts)
    //   let response = await getUserInfo('500326');
    console.log(top3Account)

    return c.res({
        image: (
            <Box fontFamily="default">
                <div tw="flex flex-col w-full h-full">
                    <img
                        style={{ objectFit: "cover" }}
                        tw="absolute inset-0 w-full h-full flex"
                        src="/red1.png"
                    />
                    <div tw="flex w-full justify-center items-center mt-52 mb-7 text-3xl">
                        <div tw="pr-2">
                            Send by
                        </div>
                        <Image
                            borderRadius="48"
                            height="48"
                            width="48"
                            src={state.pfpURL}
                        />
                        <div tw="pl-2">
                            {state.name}
                        </div>
                    </div>
                    <div tw="flex flex-col w-full h-42 bg-yellow-50 opacity-70 text-xl">
                        <div tw="flex justify-center my-2">
                            Top 3 Claimers
                        </div>
                        {
                            top3Account.map((x) => {
                                return <div tw="flex justify-between items-center px-10 py-1">
                                    <div tw="flex">
                                        {x.name}
                                    </div>
                                    <div tw="flex">
                                        {(parseFloat(x.claimAmount) / 1e18).toFixed(4)} {state.symbol}
                                    </div>
                                </div>
                            })
                        }
                    </div>
                    <div tw="flex w-full justify-center h-1/5 items-center text-3xl">{state.memo}</div>
                </div>
            </Box>

        ),
        imageAspectRatio: "1:1",
        imageOptions: {
            width: 600,
            height: 600
        },
        intents: [
            // <TextInput placeholder="Enter custom fruit..1." />,
            <Button.Link href="https://hellopay.xyz/">Check more info</Button.Link>,
            <Button action={`/${redPackageIndex}`}>⬅️ Back</Button>
            // status === 'response' && <Button.Reset>Reset</Button.Reset>,
        ],
    })
})

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined'
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development'
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
