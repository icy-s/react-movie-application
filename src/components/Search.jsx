// destructurizing component, so there will be no need to type props.searchTerm every time
const Search = (searchTerm, setSearchTerm) => {
    return (
        <div className="text-white text-3xl">{searchTerm}</div>
    )
}

export default Search