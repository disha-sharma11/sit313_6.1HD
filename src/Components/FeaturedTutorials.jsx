import CardDisplay from './CardDisplay';
import Card from './Card';
import { tutorials } from './data';

function FeaturedTutorials() {
  return (
    <section>
      <CardDisplay>
        {tutorials.map((tut, index) => (
          <Card 
            key={index}
            image={tut.img}
            title={tut.title}
            description={tut.description}
            rating={tut.rating}
            author={tut.author}
          />
        ))}
      </CardDisplay>
    </section>
  );
}

export default FeaturedTutorials;