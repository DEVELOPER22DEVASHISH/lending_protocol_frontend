import { useMemo } from 'react'
import { JsonRpcProvider, FallbackProvider } from 'ethers'
import { useClient } from 'wagmi'
import type { Chain, Client, Transport } from 'viem'

function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback') {
    const providers = (transport.transports as ReturnType<Transport>[]).map(
      ({ value }) => new JsonRpcProvider(value?.url, network)
    )
    if (providers.length === 1) return providers[0]
    return new FallbackProvider(providers)
  }
  return new JsonRpcProvider(transport.url, network)
}

export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const client = useClient({ chainId })
  return useMemo(() => (client ? clientToProvider(client) : undefined), [client])
}
