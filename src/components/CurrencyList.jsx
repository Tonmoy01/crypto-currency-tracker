import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Coin from './Coin';
import ReactPaginate from 'react-paginate';

const CurrencyList = () => {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');
  const [pageNumber, setPageNumber] = useState(0);

  useEffect(() => {
    axios
      .get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
      )
      .then((res) => {
        setCoins(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const debounce = (fn, delay = 300) => {
    let timerId;
    return function (...args) {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLocaleLowerCase())
  );

  const pageCount = Math.ceil((coins?.length / 10).toFixed(0));

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className='coin-app'>
      <div className='coin-search'>
        <div className='coin-text'>Search a Currency</div>

        <form>
          <input
            type='search'
            placeholder='Search Currency'
            className='coin-input'
            onKeyUp={debounce(function (e) {
              handleChange(e);
            })}
          />
        </form>
      </div>
      {filteredCoins &&
        filteredCoins
          .slice((pageNumber - 0) * 10, (pageNumber - 0) * 10 + 10)
          .map((coin) => {
            return (
              <Coin
                key={coin.id}
                name={coin.name}
                image={coin.image}
                symbol={coin.symbol}
                market_cap={coin.market_cap}
                price={coin.current_price}
                priceChange={coin.market_cap_change_percentage_24h}
                volume={coin.total_volume}
              />
            );
          })}

      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={'paginationBtns'}
        previousLinkClassName={'previousBtn'}
        nextLinkClassName={'nextBtn'}
        disabledClassName={'paginationDisabled'}
        activeClassName={'paginationActive'}
      />
    </div>
  );
};

export default CurrencyList;
