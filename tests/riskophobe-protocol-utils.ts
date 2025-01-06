import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  FeesClaimed,
  OfferCreated,
  OfferRemoved,
  SoldTokensAdded,
  TokensBought,
  TokensReturned
} from "../generated/RiskophobeProtocol/RiskophobeProtocol"

export function createFeesClaimedEvent(
  creator: Address,
  token: Address,
  amount: BigInt
): FeesClaimed {
  let feesClaimedEvent = changetype<FeesClaimed>(newMockEvent())

  feesClaimedEvent.parameters = new Array()

  feesClaimedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  feesClaimedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  feesClaimedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return feesClaimedEvent
}

export function createOfferCreatedEvent(
  offerId: BigInt,
  creator: Address,
  collateralToken: Address,
  soldToken: Address,
  soldTokenAmount: BigInt,
  exchangeRate: BigInt
): OfferCreated {
  let offerCreatedEvent = changetype<OfferCreated>(newMockEvent())

  offerCreatedEvent.parameters = new Array()

  offerCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  offerCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  offerCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "collateralToken",
      ethereum.Value.fromAddress(collateralToken)
    )
  )
  offerCreatedEvent.parameters.push(
    new ethereum.EventParam("soldToken", ethereum.Value.fromAddress(soldToken))
  )
  offerCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "soldTokenAmount",
      ethereum.Value.fromUnsignedBigInt(soldTokenAmount)
    )
  )
  offerCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "exchangeRate",
      ethereum.Value.fromUnsignedBigInt(exchangeRate)
    )
  )

  return offerCreatedEvent
}

export function createOfferRemovedEvent(offerId: BigInt): OfferRemoved {
  let offerRemovedEvent = changetype<OfferRemoved>(newMockEvent())

  offerRemovedEvent.parameters = new Array()

  offerRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )

  return offerRemovedEvent
}

export function createSoldTokensAddedEvent(
  offerId: BigInt,
  amount: BigInt
): SoldTokensAdded {
  let soldTokensAddedEvent = changetype<SoldTokensAdded>(newMockEvent())

  soldTokensAddedEvent.parameters = new Array()

  soldTokensAddedEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  soldTokensAddedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return soldTokensAddedEvent
}

export function createTokensBoughtEvent(
  offerId: BigInt,
  participant: Address,
  soldTokenAmount: BigInt,
  netCollateralAmount: BigInt
): TokensBought {
  let tokensBoughtEvent = changetype<TokensBought>(newMockEvent())

  tokensBoughtEvent.parameters = new Array()

  tokensBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  tokensBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )
  tokensBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "soldTokenAmount",
      ethereum.Value.fromUnsignedBigInt(soldTokenAmount)
    )
  )
  tokensBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "netCollateralAmount",
      ethereum.Value.fromUnsignedBigInt(netCollateralAmount)
    )
  )

  return tokensBoughtEvent
}

export function createTokensReturnedEvent(
  offerId: BigInt,
  participant: Address,
  collateralAmount: BigInt
): TokensReturned {
  let tokensReturnedEvent = changetype<TokensReturned>(newMockEvent())

  tokensReturnedEvent.parameters = new Array()

  tokensReturnedEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  tokensReturnedEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )
  tokensReturnedEvent.parameters.push(
    new ethereum.EventParam(
      "collateralAmount",
      ethereum.Value.fromUnsignedBigInt(collateralAmount)
    )
  )

  return tokensReturnedEvent
}
