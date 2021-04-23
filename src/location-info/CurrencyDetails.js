import React from "react";
import { DollarSign as DollarSignIcon } from "react-feather";

export default function CurrencyDetails({ currency }) {
  const getSymbols = () => {
    let symbols = currency.symbol;
    if (currency.alternate_symbols.length > 0) {
      symbols += `, ${currency.alternate_symbols.join(", ")}`;
    }

    return symbols;
  };

  const getSubUnit = () => {
    const { subunit, subunit_to_unit, symbol } = currency;
    return `${subunit} (${subunit_to_unit} ${subunit} = 1 ${symbol})`;
  };

  return (
    <div className="info-block">
      <DollarSignIcon size={24} />
      <div className="values">
        <span className="value">{currency.name}</span>
        <span className="value">
          {currency.iso_code} ({getSymbols()})
        </span>
        <span className="value">
          Smallest denomination: {currency.smallest_denomination}
        </span>
        {currency.subunit && (
          <span className="value">Subunit: {getSubUnit()}</span>
        )}
      </div>
    </div>
  );
}
