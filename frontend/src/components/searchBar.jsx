import React, { useState,useEffect } from 'react';
import '../styles/search.css'
import search from '../icons/Buttons/Search-outlined.png'

function SearchBar({map,isRegistered,darkMode}) {


    const [showFilters, setShowFilters] = useState(false);

    const [searchTerm, setSearchTerm]= useState('');

    const initialFilters = isRegistered
    ? ['everything', 'ports', 'my_areas', 'vessels', 'companies', 'my_fleets']
    : ['everything', 'ports', 'vessels', 'companies'];
  
    const [activeFilters, setActiveFilters] = useState(initialFilters);

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
        alert(`Search filters are is: ${activeFilters}`);
    }


    const toggleSearchFilters = (e) => {
        const id = e.target.id;
        
        // Define filter sets based on isRegistered
        const baseFilters = ['ports', 'vessels', 'companies'];
        const myFilters = ['my_areas', 'my_fleets'];
        const allFilters = isRegistered ? [...baseFilters, ...myFilters] : baseFilters;
        
        setActiveFilters(prev => {
            if (id === 'everything') {
            // Toggle "everything"
            return prev.includes('everything') ? [] : [...allFilters, 'everything'];
            }
        
            // Remove "everything" if any other filter clicked
            let updated = prev.filter(f => f !== 'everything');
        
            // If filter is already selected, remove it
            if (updated.includes(id)) {
            updated = updated.filter(f => f !== id);
            } 
            // Else add it (only if it is in allowed filters)
            else if (allFilters.includes(id)) {
            updated.push(id);
            }
        
            // If all filters (allowed) are selected, add "everything"
            const allSelected = allFilters.every(f => updated.includes(f));
            if (allSelected && !updated.includes('everything')) {
            updated.push('everything');
            }
        
            return updated;
        });
    };
      

    

    return(
        <div className="search">

            <div className='search-bar'>

                <form style={{ display: 'flex', flexDirection:'row', width:'90%'}} onSubmit={handleSearch}>
                    <button type='submit' className='search_button'  onSubmit={() => handleSearch()}>
                        <img src = {search} alt='search' className={`${darkMode ? 'dark-zoom' : ''}`}/>
                    </button>
                    <input className='search_prompt' type='text' placeholder='Search...' onChange={handleTyping}/> 
                </form>

               
              
                <p className='toggle-search-filters' onClick={() => setShowFilters(!showFilters) }> ... </p>
            </div>   
            
            
            {showFilters &&  
                <div className='search-filters'>
                {(isRegistered 
                    ? ['companies', 'my_areas', 'my_fleets', 'ports', 'vessels', 'everything']
                    : ['companies', 'ports', 'vessels', 'everything']
                ).map(id => (
                    <button
                    key={id}
                    id={id}
                    onClick={toggleSearchFilters}
                    className={activeFilters.includes(id) ? 'active' : ''}
                    >
                    {id.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </button>
                ))}
                </div>
            }


        </div>
    )
}

export default SearchBar;