"use client";
import Image from 'next/image';
import { FaBars, FaTimes } from 'react-icons/fa';
import { getEpisodes } from './api/episodes';
import { getAllCharacters, getCharData, getCharacters } from './api/characters';
import { useMemo, useState, useEffect, useRef } from 'react';
import Loading from './components/loading';
import {
  Episode,
  Character,
  EpisodeResult,
  CharResult,
  EpisodeMetadata,
  CharData
} from './utils/types';

type EpisodeListProps = {
  episodes: EpisodeResult[];
  onDisableScroll: (state: boolean) => void;
  onSetPage: (pageNum: number) => void;
  onSetCharList: (charList: CharResult[]) => void;
  onSetLoading: (state: boolean) => void;
  onSetMetadata: (metadata: EpisodeMetadata | null) => void;
  onOpen?: (state: boolean) => void;
}

const EpisodeList = ({
  episodes,
  onDisableScroll,
  onSetPage,
  onSetCharList,
  onSetLoading,
  onSetMetadata,
  onOpen
}: EpisodeListProps) => {

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleEpisodeSelect = async (id: number) => {
    // When user clicks on selected item, menu resets app and returns to default state
    if (id === selectedId) {
      setSelectedId(null);
      onSetMetadata(null);
      const allCharacters: CharData | null = await getAllCharacters();
      if (allCharacters) {
        onSetCharList(allCharacters.data.results);
      }
      onDisableScroll(false);
      onSetPage(1);
      if (onOpen) onOpen(false);
      return;
    }
    // Disable Infinite scroll when user is in Episode window
    // Todo, add Episode pages
    onDisableScroll(true);
    onSetLoading(true);
    const filterEp = episodes.filter(ep => ep.id === id);
    const { name, characters } = filterEp[0];
    onSetMetadata({
      name, charCount: characters.length
    });

    const characterArray: string[] = characters.map(char => {
      const getCharId = char.split('/');
      return getCharId[getCharId.length - 1]
    });

    const getChar: Character | null = await getCharacters({ chars: characterArray });

    if (getChar) {
      onSetLoading(false);
      onSetCharList(getChar.data);
      setSelectedId(id);
      if (onOpen) onOpen(false);
    }
  }

  if (episodes) {
    return (
      <ul className='space-y-2 md:space-y-3'>
        {episodes.map(ep => (
          <li key={ep.id} onClick={() => handleEpisodeSelect(ep.id)}>
            <div className={`${selectedId === ep.id ? 'border-rmTeal bg-rmPink' : 'border-rmTeal'} bg-rmGreen rounded-md md:border-4 cursor-pointer p-1 md:p-2 hover:bg-rmTeal`}>
              <p className='font-semibold text-rmYellow'>{ep.name}</p>
            </div>

          </li>
        ))}
      </ul>
    )
  }

  return (

    <div className='p-4 flex flex-col justify-center items-center'>
      <p className='font-semibold'>No Episodes Available</p>
    </div>
  )
}

export default function Home() {
  const [episodeList, setEpisodeList] = useState<EpisodeResult[]>([]);
  const [episodeMetadata, setEpisodeMetadata] = useState<EpisodeMetadata | null>(null);
  const [characterList, setCharacterList] = useState<CharResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState(false);
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const outerEl = useRef<HTMLDivElement>(null);
  const innerEl = useRef<HTMLDivElement>(null);

  useMemo(async () => {
    if (!episodeList.length) {
      setLoading(true);
      console.log('memo!!');

      const episodes: Episode | null = await getEpisodes();
      if (episodes) {
        setEpisodeList(episodes.data.results);
      }
      const allCharacters: CharData | null = await getAllCharacters();
      if (allCharacters) {
        setCharacterList(allCharacters.data.results);
        setLoading(false);
        console.log('allCharacters loading', loading);
      }

    }
    //eslint react-hooks/exhaustive-deps
  }, [episodeList.length]);


  useEffect(() => {
    const fetchData = async () => {

      if (page > 1) {
        console.log('fetchData!');

        setLoading(true);
        const allCharacters: CharData | null = await getCharData({ pageNum: page.toString() });
        if (allCharacters && !allCharacters?.data.hasOwnProperty('error')) {
          const newCharacters = allCharacters.data.results;
          setCharacterList((prevCharacters) => [...prevCharacters, ...newCharacters]);
          console.log('new characters set, page ==>', page);

          setLoading(false);
        } else {
          setLoading(false);
          setDisableInfiniteScroll(true);
        }
      }
    };
    fetchData();
  }, [page]);


  useEffect(() => {

    if (disableInfiniteScroll) return;

    const outerElement = outerEl.current;
    const handleScroll = () => {

      if (outerElement) {
        const { scrollHeight, clientHeight, scrollTop } = outerElement;

        if (scrollHeight - scrollTop !== clientHeight) {
          return;
        }

        console.log('isLoading?', loading);
        console.log('fetch data trigger', scrollHeight - scrollTop !== clientHeight, loading);

        setPage(page + 1);
        console.log('set page ===>', page);
      }

    };

    if (outerElement) {
      outerElement.addEventListener('scroll', handleScroll);
      console.log('scroller added!');
      return () => {
        console.log('scroller removed!');
        outerElement.removeEventListener('scroll', handleScroll);
      }
    }

  }, [page, disableInfiniteScroll]);


  return (
    <>
      {/* Header */}
      <header className='container mx-auto p-4 flex flex-col justify-center'>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center justify-center  text-2xl focus:outline-none transition-all duration-300 ease-in-out text-rmGreen"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
          <img
            src="https://rickandmortyapi.com/api/character/avatar/66.jpeg"
            alt="Rick and Morty Loader"
            className="w-16 md:w-20 rounded-full md-2 hidden md:block"
          />
          <div className='cursor-pointer'>
            <h1 className='text-2xl md:text-6xl text-center text-rmGreen '>Rick and Morty Characters</h1>
          </div>

        </div>
      </header>
      {/* Mobile Nav */}
      <div className="relative md:hidden">
        <div
          className={`${isOpen ? 'translate-x-0' : '-translate-x-full'
            } absolute inset-y-0 left-0 w-3/4 max-w-xs  transform transition-transform duration-300 ease-in-out md:hidden  pt-2 pb-6 px-3 h-[100vh] bg-rmTeal z-[9000] `}
        >

          <h2 className='text-2xl text-rmYellow mb-2'>Episode List</h2>
          <nav className='h-[80vh] overflow-y-scroll   w-full'>
            <EpisodeList
              episodes={episodeList}
              onDisableScroll={state => setDisableInfiniteScroll(state)}
              onSetCharList={results => setCharacterList(results)}
              onSetLoading={state => setLoading(state)}
              onSetMetadata={metadata => setEpisodeMetadata(metadata)}
              onSetPage={pageNum => setPage(pageNum)}
              onOpen={state => setIsOpen(state)}
            />
          </nav>
        </div>

      </div>
      {/* Main Container */}
      <main className="container mx-auto flex min-h-screen flex-col md:flex-row items-center md:items-start justify-between px-4 space-y-3 md:space-y-0 md:space-x-3">
        <div className="hidden md:flex flex-col items-center justify-center bg-rmYellow rounded-[2rem] border-rmTeal border-4 w-1/4 p-4">
          <h2 className='text-2xl text-rmTeal'>Episode List</h2>
          <hr className='w-full m-3 border-rmTeal' />

          <div className='max-h-[70vh] overflow-y-scroll'>
            <EpisodeList
              episodes={episodeList}
              onDisableScroll={state => setDisableInfiniteScroll(state)}
              onSetCharList={results => setCharacterList(results)}
              onSetLoading={state => setLoading(state)}
              onSetMetadata={metadata => setEpisodeMetadata(metadata)}
              onSetPage={pageNum => setPage(pageNum)}
            />
          </div>

        </div>
        <div className="relative w-full md:w-3/4">
          {characterList &&
            <>
              <div className={`h-[90vh] md:max-h-[85vh] ${isOpen ? 'overflow-hidden blur-sm' : 'overflow-y-scroll'}`} ref={outerEl}>


                <div className="relative z-10">
                  {episodeMetadata &&
                    <div className='pb-2 w-full border-b-2 border-rmTeal mb-2'>
                      <p className='font-semibold text-rmTeal'>{`${episodeMetadata.charCount} Characters in episode "${episodeMetadata.name}"`}</p>
                    </div>
                  }

                  <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 grid-rows-4 space-x-2 space-y-2' ref={innerEl}>
                    {characterList.map(char => (
                      <div key={char.id} className='flex flex-col items-center first:mt-2 first:ml-3'>
                        <div className='rounded-3xl border-rmYellow border-4 overflow-hidden w-full h-[200px]'>
                          <div className="w-full h-full relative">
                            <Image
                              src={char.image}
                              alt={char.name}
                              className="absolute inset-[0px_0px_1rem_0px] w-full h-full object-cover object-center"
                              layout="fill"
                            />
                          </div>


                        </div>
                        <div className="p-2">
                          <p className='font-semibold  text-rmTeal leading-4'>{char.name}</p>
                        </div>
                      </div>

                    ))}

                  </div>
                </div>
              </div>
              {loading && <Loading />}
            </>
          }
          {loading && !characterList &&
            <div className="h-[85vh] flex justify-center items-center">
              <Loading />
            </div>
          }
        </div>
      </main>
    </>

  )
}
