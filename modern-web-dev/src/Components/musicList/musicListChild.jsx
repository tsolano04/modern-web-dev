import React from 'react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/Components/ui/carousel';

export default function MusicList({ music }) {
  if (!Array.isArray(music) || music.length === 0) {
    return <p className="text-sm text-muted-foreground">No songs yet.</p>;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-foreground mb-6">Song List</h2>
      <Carousel
        orientation="vertical"
        opts={{ loop: true }}
        plugins={[WheelGesturesPlugin()]}
        className="pt-8 pb-8"
      >
        <CarouselPrevious />
        <CarouselContent className="h-[420px]">
          {music.map((song, i) => {
            const post = song && typeof song === 'object' ? song : { title: song };
            return (
              <CarouselItem key={post.objectId || i} className="basis-1/3">
                <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3 h-full shadow-sm">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-12 h-12 rounded object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded bg-muted shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-card-foreground text-sm truncate">{post.title}</p>
                    {(post.genre || post.suggester) && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {post.genre && <span>{post.genre}</span>}
                        {post.genre && post.suggester && <span> · </span>}
                        {post.suggester && <span>{post.suggester}</span>}
                      </p>
                    )}
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselNext />
      </Carousel>
    </div>
  );
}