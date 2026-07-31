import { Song, TemplateCard, CardData } from './types';

export const SAMPLE_SONGS: Song[] = [
  {
    id: 'song-1',
    title: 'Written in the Stars',
    artist: 'The Echoes',
    duration: '4:02',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9pnYp9apT7lXwu_14XEDkB3yISYmfsCvzfWqn9sN9ZCHjm1Jf44nf4ULu9lZkOecUjVG_R6-9J29byko4-3H1A0dG2_N_InaWecOsxgIecqmney_vZmxEMy_B22JZp664OVpC_7boQWP-BKXWtaJOuBzlZhbeCNns3hFzqd1xjlB_8pp6EKISn5SAzgO7QhmtGZ8M6P4ZphzTJnYkDNxymi-n5tP8npS2VuCuIdWzu6hQIrDXoEWY',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3'
  },
  {
    id: 'song-2',
    title: 'Fields of Gold',
    artist: 'Eva Cassidy',
    duration: '4:42',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6TGkgFAED_6N48KSgyXrk4biPqzqa0gWqyymYluRlo0G0Ksu1ZdhbolHeYqkREq9yfUE2b8XfpADKbcameNHYGL353EdezzIfA8s-GQUukAFxDlecsKC2ssipZNbdMtH0agtt4l-fV98I7g_KgAVSUxWFT9-I5l5ErG0WRifwUxsGiXoGfRDFAnoBJ1jO0OGJH1D4TIJfSnnizffp2jtf8jjI15AfjA22syZprcR_owoslubQFuT2',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73117.mp3?filename=relaxing-guitar-loop-10398.mp3'
  },
  {
    id: 'song-3',
    title: 'Midnight Solitude',
    artist: 'Lofi Jazz Archive',
    duration: '3:45',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRHFzEa21WAv9_4Qp_f2I0o0soOKQexMtHmQT8G8xX92OsWC7-T6I_-VnMIcQCgJwkqP1HwEQlfVfoCm4mfRvjfAh9TqL5ElndVtC_uZPE5GLEBkxE-8WZq87tPMZADAjIDB2Ln74bbKKjHiLhY63LSIt_KaploiNtJ9lscS70LIhvqHjBkzuFpp-82qO1LO9I7qGP0n_rqeXB5AWp7aaAdJO2PoW-dU-I6PmQSUdgvW2FUyVQXxQs',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=lofi-chill-medium-version-159456.mp3'
  },
  {
    id: 'song-4',
    title: 'Morning Dew',
    artist: 'Acoustic Wonders',
    duration: '2:12',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6TGkgFAED_6N48KSgyXrk4biPqzqa0gWqyymYluRlo0G0Ksu1ZdhbolHeYqkREq9yfUE2b8XfpADKbcameNHYGL353EdezzIfA8s-GQUukAFxDlecsKC2ssipZNbdMtH0agtt4l-fV98I7g_KgAVSUxWFT9-I5l5ErG0WRifwUxsGiXoGfRDFAnoBJ1jO0OGJH1D4TIJfSnnizffp2jtf8jjI15AfjA22syZprcR_owoslubQFuT2',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/02/10/audio_fc8b9f56a5.mp3?filename=acoustic-guitars-ambient-10237.mp3'
  },
  {
    id: 'song-5',
    title: "Lover's Waltz",
    artist: 'Classical Ink Ensemble',
    duration: '3:15',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq7f0-bmyz8I45mAjj1AEGnN0WsCrxqH1r4sV7xsCbDPLaPbPEdjCCsaJGR4gc6-hyT3fu6w8zc8B2c7qcTC6Jg0e0p_GZNY35Tp1G8vR7kANR-ZFUzecsG0H7Mj0lUoT4uF91KHXoBepak8mz9u7cdlHFGd9unKVwPI59Zkps3kl0VJFF5_ocbGMoDiTZONwzcL03cINaL6DaaAFh1njm3FROB2C-BNMzqlQwNFznplw_TznbxZUv',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939316d33.mp3?filename=sweet-piano-melody-123498.mp3'
  }
];

export const TEMPLATE_CARDS: TemplateCard[] = [
  {
    id: 'template-1',
    title: 'Wildflower Bloom',
    occasion: 'Birthday',
    quote: '"May your day grow beautiful..."',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEqRiCuA0OzQC3Jc_UGc3BSS4nVVhbVXSuEDorkORZj9jZ3ZKoeyq-SCnkaCmosSzZ3CPCcEqKBn9rJN8ok6HeSOR6KGkgkc0BOjMCgIHiHkG5Ro329pUrOc9aJInQiAOUjeiyGiKKA6zP51U-1Yun9vXG-q1WrCnfiLfWAPIJHD9if3hwtG91ntyei_7f-Ct0xzDiOHpmqtgTtHCE18StXEFhuqMYu0By9gxOhTWtuuw7XAiJdEgA',
    defaultSong: SAMPLE_SONGS[3],
    defaultHeadline: 'To the one who brings sunshine everywhere,',
    defaultMessage: 'Wishing you a year filled with gentle mornings, quiet joy, and moments that make your heart bloom.'
  },
  {
    id: 'template-2',
    title: 'Sincere Bluebell',
    occasion: 'Apology',
    quote: '"Words that are hard to say..."',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcUC25cLx6ta15DF5ep6cnvTqYegd0az0zaw1lLVaYpXLzF4ufnGYIF7qlDqJEnXxMz2u0GE1CrTS1W9VAUhhA4JHlaadP1tSXlTyms2h6fc-dtSUOxCYMrUqIC5uaS9ZRBqeFxTpDYx_Djo056Ae098noCIc6p6j3bjMSj1Trxxe_ewElqjDjZj8g7kl1ufjr4kq37y65EHSLmuVE_fKCC6Ci043K7DoE0Vc1jhRsfpA5Db_nBCgk',
    defaultSong: SAMPLE_SONGS[2],
    defaultHeadline: 'I am sorry for the distance between us,',
    defaultMessage: "I'm sorry for the silence on my end. I hope this song brings back the same warmth it brings me."
  },
  {
    id: 'template-3',
    title: 'Star-Crossed Plane',
    occasion: 'Asking Out',
    quote: '"Coffee and a flight of fancy?"',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaM-r4CRQFeGpOmf6wzFVnUWw5keXhF9LPA1zwzau-8iRLnJaYYXlOk9VqarfxNkaL_soNqt5y73Z0JmB01VgMEpBc00fRdMtYHPHipuoFQfWZsjTGWjw3Go2DUurDRzDBhNTorf1oEpjat6Z1nsqlCJQZS9nmQze6N1M-rAXV0J-pbaNNoNpubGMjPM-YxtR7hXElxS-XXGBdawvgXH3mgDBsYy_6LVs8kOUyXpKCBbR-fKpY1owl',
    defaultSong: SAMPLE_SONGS[0],
    defaultHeadline: 'Would you join me for coffee this week?',
    defaultMessage: 'Taking a little leap... I found this song today and thought we might share a quiet moment over tea or coffee soon.'
  },
  {
    id: 'template-4',
    title: 'Written in Ink',
    occasion: 'Anniversary',
    quote: '"Another year of our story..."',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6C4EKSarcBl2QBPoaGfk5Joqa6ZPdODm55vadGJW0O5pFja18pCsznQaEunx1tm-5c-4I0xiNXQ8l_hAXOTs12N4KMt1Mzcz9B5OBOl6y45ey2DvIz7mESsg23H7XeFumEw8YHPX-bfsIvnAcQzHB7w-Ti79XH4tP1AH93dHi9R2yMPwp-JopNfuhta2B4ibWLt-yptwc1LDpdCJStOd81AEvlwPxX4S-4sscUa5Xy0qwqFL3F_dK',
    defaultSong: SAMPLE_SONGS[1],
    defaultHeadline: 'To my favorite chapter of all,',
    defaultMessage: 'Every year with you feels like discovering a new favorite melody. Thank you for walking beside me through every season.'
  },
  {
    id: 'template-5',
    title: 'Starlight Dreams',
    occasion: 'General',
    quote: '"When the world feels magical."',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9DI8w_SHWOqXc0SbNBwhytUdz_keK-StoqR6KO4jKBFn0jgRc0cMOu-a-G9oEsW2YSZKfJMDJvInDCF8GZV5NmVB7Zwb2j2xFkiXcmUif1-xNPeeMlLusqRgutvQJTrxE-yM7taAk_PqOF_Do-0Akk99dAuLZdaEjHXI_rlRyGYoZXAv79YuwxeyLpyocJFCUYqeo1h86Np_wveNBo_K58QcBcQZIDTl03FLpiNnIpcJRDwWHYlnK',
    defaultSong: SAMPLE_SONGS[0],
    defaultHeadline: 'To the one who remembers the small things,',
    defaultMessage: 'Some moments are meant to be kept in pockets, tucked away from the noise of the world. I hope when you hear this, you feel peace.'
  },
  {
    id: 'template-6',
    title: 'Sun-Drenched Morning',
    occasion: 'Birthday',
    quote: '"A warm, quiet moment."',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZKJMj4FlWVVtBElgQ6O2a1ttL1FT_e8e5uI34nRvhWz1c79HyCxlOuq2Qn-ypLMzVHxAoVrqFEaKkwxiTS8-9NQFdCeumnkNzd6Rg-Eq7Hw95yktrBs-ESDAk1CqgK5QzciVYpWOOOkQYG2AW08u4n2F8E1pJcgQaR_-hunPtDS3Yu1xf8aPIg4E6Wnno4Uxckc1RCGmYytxLG1nZCllBDW5uvuZWtr0ZxxtBZQzhyQn80TyQcaiY',
    defaultSong: SAMPLE_SONGS[3],
    defaultHeadline: 'That golden hour memory,',
    defaultMessage: 'Remembering that sun-drenched afternoon. Here is a song to keep that cozy warmth with you today.'
  },
  {
    id: 'template-7',
    title: 'Warm Thoughts',
    occasion: 'General',
    quote: '"Just a little hello..."',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjtFL66H_SaPDV1EOonGF_4EzHXm3WFJ83Ux1kGxACKl5GVSt68yn1TywlI4gzTEix9rVS7e5fXghllGyshoCqxvFSGKqvstd6Nyae9NbKvhl3ClSaNMJcJxaP71OQHOdPYXEovuAcpPviKsjsb7Rk8KApcU83lpwOcPpb-Vo6ZLwizfJh4CfALJbStIkCxhouMDZ87hT_2YFyju11s8goHpRpqlIk57EHm1ic6M9ommaGhO7XAd7j',
    defaultSong: SAMPLE_SONGS[2],
    defaultHeadline: 'Sending a cup of warmth your way,',
    defaultMessage: 'No special occasion needed—just wanted to drop a quiet note and a gentle song into your day.'
  },
  {
    id: 'template-8',
    title: 'One Bright Wish',
    occasion: 'Birthday',
    quote: '"Blow out the candle..."',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqX8sJAC3HldOeeQlZ1Rbe9-AFqb1jWM-JavuuzkOK2o6Lko-7pDSYtztMFJ3wDPso1B1ejOz-CHgs5lMlmRWr6PnDc_Wp-TRdhxNKrNkHL4f_MBtAzMMQGSQJ-HP6E0kBMlvW8mdx2Jgx8SuZNixXANhehnZ8pccoCarpepDVyZqEzYAc6UD5gYinoaIPFIGQpbKQnLvyDOvkFSOkEMg-AyCEpsnl5N7adwXactQA44KPV1bkFpJ3',
    defaultSong: SAMPLE_SONGS[4],
    defaultHeadline: 'Make a wish!',
    defaultMessage: 'May all your secret wishes find their way to the light this coming year.'
  },
  {
    id: 'template-9',
    title: 'After the Rain',
    occasion: 'Apology',
    quote: '"A fresh start for us..."',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArIfxBNIsxX20acCc35rkXHSMmjnqfY5R-DA32MEa9-folCK69rfsYa6sdQxx-Gr7isUrqYXk2VbE-QgAEbe-qioOZM5vzyriku2JYNaOPbq2gJC3ZjZ-qsO-hdvSAt7FD782vEisb-5Av8JWmVF0oUJyxdqtwah5PWfTQCbbi8CGLNPS-HRm13ir93yLxB48wsA0HItfi2viGE4NhlAMjSe3CNolNw_OHRbIANw-2lv-_qicJ7kq9',
    defaultSong: SAMPLE_SONGS[2],
    defaultHeadline: 'After the rain comes quiet peace,',
    defaultMessage: 'I hope we can clear the air and hold onto what truly matters. Thinking of you always.'
  },
  {
    id: 'template-10',
    title: 'Simple Hearts',
    occasion: 'Asking Out',
    quote: '"Taking a little leap..."',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwaaoAdqEo0WwRis3KXhGzAZIWlAIE2WkQHeoXuzmfwcrnfJx84U2WnfU3Uk-31s61kclmrXEJrALe_KzwuzUcvl9o_19JnFg15J1iCHPeZRoR1rt1dvgo5mBHbLCLjRjI1J-vXCArfsqQVc05RPpdpKGNrm9cOmbIJKzb1Anc1ZR9tKEHKpme_otbeLChEaPNgA90Zm2v_Fe6LP5DICW-kZ7O5KICHUQF3UGaC-0rVZLxZxZGutxY',
    defaultSong: SAMPLE_SONGS[1],
    defaultHeadline: 'Simple hearts, genuine hopes,',
    defaultMessage: 'Will you go out with me? I brought a song for you to listen to while you decide.'
  }
];

export const INITIAL_CARD_DATA: CardData = {
  id: 'card-demo-1',
  title: 'Written in the Stars',
  occasion: 'General',
  photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq7f0-bmyz8I45mAjj1AEGnN0WsCrxqH1r4sV7xsCbDPLaPbPEdjCCsaJGR4gc6-hyT3fu6w8zc8B2c7qcTC6Jg0e0p_GZNY35Tp1G8vR7kANR-ZFUzecsG0H7Mj0lUoT4uF91KHXoBepak8mz9u7cdlHFGd9unKVwPI59Zkps3kl0VJFF5_ocbGMoDiTZONwzcL03cINaL6DaaAFh1njm3FROB2C-BNMzqlQwNFznplw_TznbxZUv',
  photoCaption: 'That golden hour.',
  photoRotation: -2,
  headline: 'To the one who remembers the small things,',
  message: 'I found this song today and immediately thought of that afternoon by the lake. The way the light filtered through the trees and everything felt momentarily paused.\n\nSome moments are meant to be kept in pockets, tucked away from the noise of the world. This is one of them. I hope when you hear this, you feel the same quiet peace I felt writing this.',
  senderName: 'E.',
  dateStr: 'October 24th, 2023',
  location: 'Somewhere quiet',
  song: SAMPLE_SONGS[0],
  inkColor: '#5E1E24',
  fontStyle: 'handwritten',
  stickers: [
    { id: 'st-1', icon: 'favorite', color: '#FFB7B2', x: 80, y: 15, rotation: 12 },
    { id: 'st-2', icon: 'local_florist', color: '#A5A58D', x: 15, y: 75, rotation: -8 }
  ],
  createdAt: new Date().toISOString(),
  expiresInDays: 7
};
