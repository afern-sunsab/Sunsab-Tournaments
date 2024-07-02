
export default function Page ({params}) {
    const id = params.tournament
    return (
        <div>
            <h1>Bracket for tournament {id}</h1>
        </div>
    )
}