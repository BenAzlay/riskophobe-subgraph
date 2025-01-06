import { BigInt } from "@graphprotocol/graph-ts";
import {
  OfferCreated,
  TokensBought,
  FeesClaimed,
} from "../generated/RiskophobeProtocol/RiskophobeProtocol";
import { Offer, Deposit, CreatorFee } from "../generated/schema";

export function handleOfferCreated(event: OfferCreated): void {
  let offer = new Offer(event.params.offerId.toString());
  offer.creator = event.params.creator;
  offer.collateralToken = event.params.collateralToken;
  offer.soldToken = event.params.soldToken;
  offer.soldTokenAmount = event.params.soldTokenAmount;
  offer.exchangeRate = event.params.exchangeRate;
  offer.save();
}

export function handleTokensBought(event: TokensBought): void {
  let depositId =
    event.params.offerId.toString() + "-" + event.params.participant.toHex();
  let deposit = new Deposit(depositId);
  deposit.offerId = event.params.offerId;
  deposit.participant = event.params.participant;
  deposit.soldTokenAmount = event.params.soldTokenAmount;
  deposit.netCollateralAmount = event.params.netCollateralAmount;
  deposit.save();
}

export function handleFeesClaimed(event: FeesClaimed): void {
  let feeId = event.params.creator.toHex() + "-" + event.params.token.toHex();
  let creatorFee = CreatorFee.load(feeId);
  if (creatorFee == null) {
    creatorFee = new CreatorFee(feeId);
    creatorFee.creator = event.params.creator;
    creatorFee.token = event.params.token;
    creatorFee.amount = BigInt.fromI32(0);
  }
  creatorFee.amount = creatorFee.amount.plus(event.params.amount);
  creatorFee.save();
}
