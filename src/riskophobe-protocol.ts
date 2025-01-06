import {
  FeesClaimed as FeesClaimedEvent,
  OfferCreated as OfferCreatedEvent,
  OfferRemoved as OfferRemovedEvent,
  SoldTokensAdded as SoldTokensAddedEvent,
  TokensBought as TokensBoughtEvent,
  TokensReturned as TokensReturnedEvent
} from "../generated/RiskophobeProtocol/RiskophobeProtocol"
import {
  FeesClaimed,
  OfferCreated,
  OfferRemoved,
  SoldTokensAdded,
  TokensBought,
  TokensReturned
} from "../generated/schema"

export function handleFeesClaimed(event: FeesClaimedEvent): void {
  let entity = new FeesClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.creator = event.params.creator
  entity.token = event.params.token
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOfferCreated(event: OfferCreatedEvent): void {
  let entity = new OfferCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerId = event.params.offerId
  entity.creator = event.params.creator
  entity.collateralToken = event.params.collateralToken
  entity.soldToken = event.params.soldToken
  entity.soldTokenAmount = event.params.soldTokenAmount
  entity.exchangeRate = event.params.exchangeRate

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOfferRemoved(event: OfferRemovedEvent): void {
  let entity = new OfferRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerId = event.params.offerId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSoldTokensAdded(event: SoldTokensAddedEvent): void {
  let entity = new SoldTokensAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerId = event.params.offerId
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokensBought(event: TokensBoughtEvent): void {
  let entity = new TokensBought(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerId = event.params.offerId
  entity.participant = event.params.participant
  entity.soldTokenAmount = event.params.soldTokenAmount
  entity.netCollateralAmount = event.params.netCollateralAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokensReturned(event: TokensReturnedEvent): void {
  let entity = new TokensReturned(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerId = event.params.offerId
  entity.participant = event.params.participant
  entity.collateralAmount = event.params.collateralAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
