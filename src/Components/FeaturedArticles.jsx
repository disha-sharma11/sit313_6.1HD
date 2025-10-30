import CardDisplay from './CardDisplay';
import Card from './Card';
import { articles } from './data';

function FeaturedArticles() {
  return (
    <section>
      <CardDisplay>
        {articles.map((art, index) => (
          <Card 
            key={index}
            image={art.img}
            title={art.title}
            description={art.description}
            rating={art.rating}
            author={art.author}
          />
        ))}
      </CardDisplay>
    </section>
  );
}

export default FeaturedArticles;