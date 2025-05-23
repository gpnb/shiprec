import React, { useState,useEffect } from 'react';
import '../styles/search.css'
import search from '../icons/Buttons/Search-outlined.png'

function SearchBar({map}) {


    const [showFilters, setShowFilters] = useState(false);

    const [searchTerm, setSearchTerm]= useState('');

    const [activeFilters, setActiveFilters] = useState([]);

     useEffect(() => {
        console.log('Active filters updated:', activeFilters);
    }, [activeFilters]);


    // captures the user's input
    const handleTyping = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.value);

    }

    // search logic goes here
    const handleSearch = (e) => {
        e.preventDefault();
        alert(`Search term is: ${searchTerm}`);
    }


    const toggleSearchFilters = (e) => {
        const id = e.target.id;

        if(activeFilters.length === 5 ) {
            setActiveFilters(['all']);
           

            console.log(activeFilters)
            return;
        }


        setActiveFilters(prev => prev.includes(id) ? prev.filter(filter => filter !== id) : [...prev, id]);
    };

    

    return(
        <div className="search">

            <div className='search-bar'>

                <form style={{ display: 'flex', flexDirection:'row', width:'90%'}} onSubmit={handleSearch}>
                    <button type='submit' className='search_button'  onSubmit={() => handleSearch()}>
                        <img src = {search} alt='search' />
                    </button>
                    <input className='search_prompt' type='text' placeholder='Search...' onChange={handleTyping}/> 
                </form>

               
              
                <p className='toggle-search-filters' onClick={() => setShowFilters(!showFilters) }> ... </p>
            </div>   
            
            
            {showFilters &&  
                <div className='search-filters'>
                    {['ports', 'areas', 'vessels', 'companies', 'my_fleets', 'Everything'].map(id => (
                    <button key={id} id={id} onClick={toggleSearchFilters} className={activeFilters.includes(id) ? 'active' : ''}>
                        {id.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </button>
                    ))}
                </div>
            }


        </div>
    )
}

export default SearchBar;