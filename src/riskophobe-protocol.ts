import { Address, BigInt, store } from "@graphprotocol/graph-ts";
import {
  OfferCreated,
  TokensBought,
  FeesClaimed,
  RiskophobeProtocol,
  SoldTokensAdded,
  TokensReturned,
  OfferRemoved,
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

// OFFER
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
  offer.creatorFeeBp = BigInt.fromI32(offerDetails.getCreatorFeeBp());
  offer.collateralBalance = offerDetails.getCollateralBalance();

  offer.save();
}

export function handleSoldTokensAdded(event: SoldTokensAdded): void {
  let offer = Offer.load(event.params.offerId.toString());
  if (offer == null) {
    return; // No such offer exists; ignore this event.
  }
  offer.soldTokenAmount = offer.soldTokenAmount.plus(event.params.amount);
  offer.save();
}

export function handleOfferRemoved(event: OfferRemoved): void {
  let offerId = event.params.offerId.toString();
  let offer = Offer.load(offerId);
  if (offer != null) {
    store.remove("Offer", offerId);
  }
}

// DEPOSIT
export function handleTokensBought(event: TokensBought): void {
  // Get offer
  let offer = Offer.load(event.params.offerId.toString());
  if (offer == null) return; // Offer must exist for a valid calculation

  let depositId =
    event.params.offerId.toString() + "-" + event.params.participant.toHex();
  let deposit = Deposit.load(depositId);

  // Calculate earned creator fee
  let feeAmount = event.params.collateralAmount
    .times(offer.creatorFeeBp)
    .div(BigInt.fromI32(10000));
  // Calculate netCollateralAmount from collateralAmount and feeAmount
  let netCollateralAmount = event.params.collateralAmount.minus(feeAmount);

  if (deposit == null) {
    deposit = new Deposit(depositId);
    deposit.offerId = event.params.offerId;
    deposit.participant = event.params.participant;
    deposit.netCollateralAmount = netCollateralAmount;
  } else {
    deposit.netCollateralAmount =
      deposit.netCollateralAmount.plus(netCollateralAmount);
  }
  deposit.save();

  // Update offer
  // Increase collateralBalance
  offer.collateralBalance = offer.collateralBalance.plus(netCollateralAmount);

  // Decrease soldTokenAmount
  let soldTokenDecrease = event.params.soldTokenAmount;
  offer.soldTokenAmount = offer.soldTokenAmount.minus(soldTokenDecrease);

  offer.save();

  // Update creatorFee
  let creatorFeeId = offer.creator.toHex() + "-" + offer.collateralToken;
  let creatorFee = CreatorFee.load(creatorFeeId);
  if (creatorFee == null) {
    creatorFee = new CreatorFee(creatorFeeId);
    creatorFee.creator = offer.creator;
    creatorFee.token = offer.collateralToken;
    creatorFee.amount = feeAmount;
  } else {
    creatorFee.amount = creatorFee.amount.plus(feeAmount);
  }
  creatorFee.save();
}

export function handleTokensReturned(event: TokensReturned): void {
  let depositId =
    event.params.offerId.toString() + "-" + event.params.participant.toHex();
  let deposit = Deposit.load(depositId);
  let offer = Offer.load(event.params.offerId.toString());
  // Update the Offer entity
  if (offer == null || deposit == null) return;

  // Decrease deposit collateralAmount
  deposit.netCollateralAmount = deposit.netCollateralAmount.minus(
    event.params.collateralAmount
  );

  deposit.save();

  // Decrease offer collateralBalance
  offer.collateralBalance = offer.collateralBalance.minus(
    event.params.collateralAmount
  );
  // Increase offer soldTokenAmount
  offer.soldTokenAmount = offer.soldTokenAmount.plus(
    event.params.soldTokenAmount
  );

  offer.save();
}

// CREATOR FEE
export function handleFeesClaimed(event: FeesClaimed): void {
  let creatorFeeId =
    event.params.creator.toHex() + "-" + event.params.token.toHex();
  let creatorFee = CreatorFee.load(creatorFeeId);
  if (creatorFee == null) {
    return; // No creator fee exists for this combination, ignore the event
  }

  // Decrease the available fee amount
  let claimedAmount = event.params.amount;
  creatorFee.amount = creatorFee.amount.minus(claimedAmount);

  // Ensure the amount doesn't go negative
  if (creatorFee.amount.lt(BigInt.fromI32(0))) {
    creatorFee.amount = BigInt.fromI32(0);
  }

  creatorFee.save();
}
