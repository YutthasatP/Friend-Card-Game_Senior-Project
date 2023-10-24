import './TrumpCard.css'

function TrumpCard({cardName}) {
  // const cardName = '9_of_clubs.svg'
  const cardPath = "\\SVG-cards-1.3\\" + cardName
  return (
    <section className='trump_card'>
        <div className='card_img'>
          <img src={cardPath} alt="" />
        </div>
        <p>TRUMP</p>
    </section>
    

      
  )
}
export default TrumpCard