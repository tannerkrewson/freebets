import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { calcHedge, calcProfitPerc, calcProfitNum, computeEv, computeConversion } from "../../Utils"
import { BetType } from "../../enums";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 300,
  width: "50%",
  maxWidth: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "8px",
  p: 4,
};

export default function ModalLink({ bet, betType, mode }) {
  const [open, setOpen] = useState(false);
  const [amount_a, setAmount_a] = useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const func = betType.value === BetType.ARBITRAGE ? computeEv : computeConversion;
  const ba = Math.abs(func(bet.outcomes[0].odds, bet.outcomes[1].odds) - bet.rate);
  const ab = Math.abs(func(bet.outcomes[1].odds, bet.outcomes[0].odds) - bet.rate);
  const odds_a = (ab > ba) ? bet.outcomes[0].odds : bet.outcomes[1].odds;
  const odds_b = (ab > ba) ? bet.outcomes[1].odds : bet.outcomes[0].odds;
  const amount_b = calcHedge(betType, amount_a, odds_a, odds_b)
  const profit = calcProfitNum(betType, amount_a, amount_b, odds_a, odds_b);
  const perc = calcProfitPerc(betType, amount_a, amount_b, profit);
  return (
    <div>
      <button className="foot-link" onClick={handleOpen}>
        {mode === 2 ? (
          <FontAwesomeIcon className="card-calc-link" size="2x" icon={faCalculator} />
        ) : (
          <FontAwesomeIcon className="slab-calc-link" size="2x" icon={faCalculator} />
        )}
      </button>
      <Modal open={open} onClose={handleClose} disableAutoFocus={true} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <label>Free Bet</label>
          <input className="usr-input-bet-amount" value={amount_a} onChange={(event) => { setAmount_a(Number(event.target.value)) }}></input>
          <label>Odds</label>
          <input value={bet.outcomes[0].odds}></input>
          <label>Hedge Bet</label>
          <input value={amount_b}></input>
          <label>Odds</label>
          <input value={bet.outcomes[1].odds}></input>
          <span>Profit: ${profit[0]} - ${profit[1]}</span>
          <br />
          <span>% Profit: {perc[0]}% - {perc[1]}%</span>
        </Box>
      </Modal>
    </div>
  );
}
