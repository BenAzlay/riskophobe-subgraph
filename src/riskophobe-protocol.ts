import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  OfferCreated,
  TokensBought,
  FeesClaimed,
  RiskophobeProtocol,
} from "../generated/RiskophobeProtocol/RiskophobeProtocol";
import { Offer, Deposit, CreatorFee, Token } from "../generated/schema";
import { ERC20 } from "../generated/RiskophobeProtocol/ERC20";

function getOrCreateToken(address: Address): Token {
  let token = Token.load(address.toHex());
  if (token == null) {
    token = new Token(address.toHex());
    let erc20 = ERC20.bind(address);
    let symbolCall = erc20.try_symbol();
    let decimalsCall = erc20.try_decimals();

    token.symbol = symbolCall.reverted ? "" : symbolCall.value;
    token.decimals = decimalsCall.reverted ? 18 : decimalsCall.value;
    token.save();
  }
  return token;
}

export function handleOfferCreated(event: OfferCreated): void {
  let offer = new Offer(event.params.offerId.toString());
  offer.creator = event.params.creator;
  
  // Populate collateralToken and soldToken with relevant metadata
  let collateralToken = getOrCreateToken(event.params.collateralToken);
  let soldToken = getOrCreateToken(event.params.soldToken);
  offer.collateralToken = collateralToken.id;
  offer.soldToken = soldToken.id;

  offer.soldTokenAmount = event.params.soldTokenAmount;
  offer.exchangeRate = event.params.exchangeRate;

  // Additional attributes not included in the event but part of the contract state
  let contract = RiskophobeProtocol.bind(event.address);
  let offerDetails = contract.offers(event.params.offerId);

  offer.startTime = offerDetails.getStartTime();
  offer.endTime = offerDetails.getEndTime();
  offer.creatorFeeBp = offerDetails.getCreatorFeeBp();
  offer.collateralBalance = offerDetails.getCollateralBalance();

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
