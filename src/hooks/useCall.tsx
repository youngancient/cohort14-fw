const useCall = () => {
  const isCorrectAddress = (address: string) => {
    return address.trim().length == 40;
  };

  const loadToken = (address: string) => {
    if (!isCorrectAddress(address)) {
      alert("Invalid Address");
      return;
    }

    alert(`Loading ERC20 Token with CA: ${address}...`);
  };

  const balanceOf = (address: string) => {
    if (!isCorrectAddress(address)) {
      alert("Invalid Address");
      return;
    }

    alert(`balanceOf called with: ${address}`);
  };

  const allowance = (owner: string, spender: string) => {
    if (!isCorrectAddress(owner) || !isCorrectAddress(spender)) {
      alert("Invalid Address");
      return;
    }

    alert(`allowance called with: ${[owner, spender].join(", ")}`);
  };

  const mint = (address: string, amount: string) => {
    if (!isCorrectAddress(address) || !parseInt(amount)) {
      alert("Invalid Address or Amount");
      return;
    }

    alert(`mint called with: ${[address, amount].join(", ")}`);
  };

  const transfer = (to: string, amount: string) => {
    if (!isCorrectAddress(to) || !parseInt(amount)) {
      alert("Invalid Address or Amount");
      return;
    }

    alert(`transfer called with: ${[to, amount].join(", ")}`);
  };

  const transferFrom = (from: string, to: string, amount: string) => {
    if (!isCorrectAddress(from)  || !isCorrectAddress(to) || !parseInt(amount)) {
      alert("Invalid Address or Amount");
      return;
    }

    alert(`transferFrom called with: ${[from, to, amount].join(", ")}`);
  };

  const approve = (spender: string, amount: string) => {
    if (!isCorrectAddress(spender)  || !parseInt(amount)) {
      alert("Invalid Address or Amount");
      return;
    }

    alert(`approve called with: ${[spender, amount].join(", ")}`);
  }
  
  return {
    loadToken,
    balanceOf,
    allowance,
    mint,
    transfer,
    transferFrom,
    approve
  };
}

export default useCall;