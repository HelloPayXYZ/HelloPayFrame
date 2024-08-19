import axios from "axios";

const thegraph_api = "https://api.studio.thegraph.com/query/63989/hellopaypolygon/version/latest"

const PINNATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjZTk5MDEzNy1lN2E5LTQwMGEtOTE1MS04MWNiNDMwMDc3YzciLCJlbWFpbCI6ImpheXNvbmRlZmluZXJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjBjZjNlODYxY2UwNjVjN2RiNTBlIiwic2NvcGVkS2V5U2VjcmV0IjoiMjkwYjM5N2FjNmI0NGNhODhlN2I0MGYwMmYyZTdhNDhhOTYxMDljMzUzYmQ0N2FhZWUzOWFlMzRkZDBjZmMzYyIsImlhdCI6MTcxNTA2MzMwMX0.tf6xqo9JhVLb8KlVt2vJx4YodrJ6oFfqdY5cvShGaeM"
// const KEY = "0cf3e861ce065c7db50e"
const options = { headers: { Authorization: `Bearer ${PINNATA_JWT}`, "Content-Type": "application/json" } };


interface ClaimRecordInfo {
    fid: string,
    account: string,
    claimAmount: string,
}

interface TopAccountInfo {
    fid: string,
    name: string,
    pfp: string,
    claimAmount: string,
}
  
interface RedPackageInfo { 
    redPackge: {
        id: string,
        account: string,
        fid: string,
        isNativeToken: boolean,
        remainAmount: string,
        remainNumber: string,
        starttime: string,
        token: string,
        totalAmount: string,
        totalNumber: string,
        symbol: string,
        memo: string,
        rpType: string,
        accounts: ClaimRecordInfo[]
    }
}

export async function getUserInfo(fid: string) {
    let response = await axios.get(`https://api.pinata.cloud/v3/farcaster/users/${fid}`, options)

    // let response2 = await axios.get('https://i.seadn.io/gae/lhGgt7yK1JiBVYz_HBxcAmYLRtP03aw5xKX4FgmFT9Ai7kLD5egzlLvb0lkuRNl28shtjr07DC8IHzLUkTqlWUMndUzC9R5_MSxH3g?w=500&auto=format')


    // let x = encodeURIComponent('https://i.seadn.io/gae/lhGgt7yK1JiBVYz_HBxcAmYLRtP03aw5xKX4FgmFT9Ai7kLD5egzlLvb0lkuRNl28shtjr07DC8IHzLUkTqlWUMndUzC9R5_MSxH3g?w=500&auto=format')

    // console.log(x)
    return response.data.user
}

export async function getRedPackageInfo(index: string) {
    const query = `
        query($index:ID){
            redPackge(id:$index){
                id
                account
                fid
                isNativeToken
                remainAmount
                remainNumber
                starttime
                token
                totalAmount
                totalNumber
                memo
                rpType
                symbol
                accounts {
                    fid
                    account
                    claimAmount
                }
            }
        }
    `;
    const variables = {
        index
    }

    const res = await queryGraphql<RedPackageInfo>(thegraph_api, query, variables);
    return res.data?.redPackge

}


export async function getUserClaimedInfo(fid: string, index: string) {
    const queryID = index + '-' + fid

    const query = `
        query($queryID:ID){
            claimRecord(id:$queryID) {
                id
                fid
                account
                claimAmount
            }
        }
    `;
    const variables = {
        queryID
    }

    const res = await queryGraphql<{claimRecord: ClaimRecordInfo}>(thegraph_api, query, variables);

    return res.data?.claimRecord

}

export async function getTop3Account(account: ClaimRecordInfo[]) : Promise<TopAccountInfo[]> {
    account.sort((a, b) => {
        return parseInt(a.claimAmount) - parseInt(b.claimAmount)
    })

    let result: TopAccountInfo[] = []
    for (let i = 0; i < account.length && i < 3; i++) {
        let response = await getUserInfo(account[i].fid)

        result.push({
            fid: account[i].fid,
            name: response.display_name,
            pfp: response.pfp_url,
            claimAmount: account[i].claimAmount,
        } as TopAccountInfo)
    }
    return result
}

function queryGraphql<T>(api: string, query: string, variables: any): Promise<{ data: T | null }> {
    return fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      })
    }).then(r => {
      return r.json()
    }).then(
      res => {
        return res as { data: T };
      }
    );
  }