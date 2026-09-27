import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding EduBridge database...')

  // 1. Clean existing records for fresh seed
  await prisma.aIMessage.deleteMany()
  await prisma.aIConversation.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.progress.deleteMany()
  await prisma.testAnswer.deleteMany()
  await prisma.testAttempt.deleteMany()
  await prisma.testQuestion.deleteMany()
  await prisma.test.deleteMany()
  await prisma.practiceAttempt.deleteMany()
  await prisma.question.deleteMany()
  await prisma.videoResource.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.chapter.deleteMany()
  await prisma.subject.deleteMany()
  await prisma.classLevel.deleteMany()
  await prisma.studentProfile.deleteMany()
  await prisma.user.deleteMany()

  // 2. Class Levels
  const classesData = [
    { name: 'Class 5', order: 5 },
    { name: 'Class 6', order: 6 },
    { name: 'Class 7', order: 7 },
    { name: 'Class 8', order: 8 },
    { name: 'Class 9', order: 9 },
    { name: 'Class 10', order: 10 },
  ]
  const classLevels: Record<string, any> = {}
  for (const c of classesData) {
    classLevels[c.name] = await prisma.classLevel.create({ data: c })
  }

  // 3. Demo User & Profile
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash('demo123', salt)

  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@student.com',
      passwordHash,
      role: 'STUDENT',
      profile: {
        create: {
          fullName: 'Aarav Sharma',
          gradeClass: 'Class 8',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          streakDays: 4,
        }
      }
    }
  })
  console.log('Created Demo Student:', demoUser.email)

  // 4. Curriculum Data
  const subjectsData = [
    {
      slug: 'physics',
      name: 'Physics',
      description: 'Explore fundamental laws of universe, motion, forces, light, sound and energy.',
      accentColor: 'blue',
      icon: 'Atom',
      order: 1,
      chapters: [
        {
          title: 'Physical Quantities and Measurement',
          description: 'Understanding standard SI units, measuring length, mass, volume, time and density accurately.',
          video: {
            title: 'Motion in a Straight Line: Crash Course Physics #1',
            embedUrl: 'https://www.youtube.com/embed/ZM8ECpBuQYE',
            duration: '10:40',
            licenseOrAuthorization: 'Authorized Educational Embed (Open Creative Commons)'
          },
          lessons: [
            {
              title: 'Fundamental SI Units and Systems',
              objective: 'Learn why standard units exist and master the 7 SI base quantities.',
              simpleContent: 'Before standard units, people used handspans and foot-lengths, which led to confusion. Today, we use the International System of Units (SI). Length is measured in meters (m), mass in kilograms (kg), and time in seconds (s).',
              workedExample: 'Example: Convert 5.4 kilometers into meters.\nSolution: 1 km = 1,000 meters. Therefore, 5.4 × 1,000 = 5,400 meters.',
              keyPoints: JSON.stringify([
                'SI stands for Système International d’Unités.',
                'The standard unit for length is meter (m), for mass is kilogram (kg), and for time is second (s).',
                'Derived quantities like area (m²) and speed (m/s) come from base units.'
              ]),
              quickQuiz: JSON.stringify([
                {
                  question: 'What is the standard SI unit of mass?',
                  options: ['Gram', 'Kilogram', 'Pound', 'Tonne'],
                  answer: 1,
                  explanation: 'The International System of Units defines the kilogram (kg) as the base unit for mass.'
                }
              ])
            }
          ],
          questions: [
            {
              text: 'Which of the following is a base SI quantity?',
              options: ['Speed', 'Time', 'Volume', 'Density'],
              correct: 1,
              explanation: 'Time is one of the seven fundamental SI quantities, measured in seconds (s).'
            },
            {
              text: 'How many centimeters are there in 2.5 meters?',
              options: ['25 cm', '250 cm', '2500 cm', '0.25 cm'],
              correct: 1,
              explanation: '1 meter = 100 centimeters. 2.5 × 100 = 250 cm.'
            }
          ]
        },
        {
          title: 'Motion and Speed',
          description: 'Study distance, displacement, uniform and non-uniform speed, velocity and acceleration.',
          video: {
            title: "Newton's Laws: Crash Course Physics #5",
            embedUrl: 'https://www.youtube.com/embed/kKKM8Y-u7ds',
            duration: '11:04',
            licenseOrAuthorization: 'Authorized Educational Embed (Open Creative Commons)'
          },
          lessons: [
            {
              title: 'Speed, Distance and Time Equations',
              objective: 'Calculate average speed and understand motion graphs.',
              simpleContent: 'Speed is the rate at which an object covers distance. It is a scalar quantity (has magnitude but no direction). Speed = Distance ÷ Time. In SI units, speed is measured in meters per second (m/s) or kilometers per hour (km/h).',
              workedExample: 'A school bus travels 60 kilometers in 2 hours. What is its average speed?\nSpeed = Distance / Time = 60 km / 2 h = 30 km/h.',
              keyPoints: JSON.stringify([
                'Speed = Distance / Time.',
                'Velocity includes both speed and direction.',
                'Uniform speed means covering equal distances in equal intervals of time.'
              ]),
              quickQuiz: JSON.stringify([
                {
                  question: 'If a cyclist moves 100 meters in 20 seconds, what is their speed?',
                  options: ['2 m/s', '5 m/s', '20 m/s', '50 m/s'],
                  answer: 1,
                  explanation: 'Speed = 100 m / 20 s = 5 m/s.'
                }
              ])
            }
          ],
          questions: [
            {
              text: 'What distinguishes velocity from speed?',
              options: ['Speed has direction, velocity does not', 'Velocity has direction, speed does not', 'Velocity is always greater than speed', 'There is no difference'],
              correct: 1,
              explanation: 'Velocity is a vector quantity, having both magnitude (speed) and a specific direction.'
            },
            {
              text: 'If a runner covers 400m in 50 seconds, their average speed is:',
              options: ['4 m/s', '8 m/s', '10 m/s', '12 m/s'],
              correct: 1,
              explanation: 'Speed = 400 / 50 = 8 m/s.'
            }
          ]
        },
        {
          title: 'Force and Pressure',
          description: 'Examine push and pull, balanced and unbalanced forces, friction, and fluid pressure.',
          video: {
            title: 'Friction and Force: Crash Course Physics #6',
            embedUrl: 'https://www.youtube.com/embed/fo_pmp5rtzo',
            duration: '10:30',
            licenseOrAuthorization: 'Authorized Educational Embed (Open Creative Commons)'
          },
          lessons: [
            {
              title: 'Types of Forces and Pressure Formula',
              objective: 'Analyze how contact and non-contact forces act and compute pressure on surfaces.',
              simpleContent: 'A force is a push or pull upon an object resulting from interaction with another object. Pressure is defined as the force acting per unit area: Pressure = Force / Area. When area is smaller (like a sharp needle), pressure is much higher for the same force!',
              workedExample: 'A force of 50 N is applied on an area of 2 m². What is the pressure?\nPressure = Force / Area = 50 N / 2 m² = 25 Pascals (Pa).',
              keyPoints: JSON.stringify([
                'Force unit is Newton (N).',
                'Pressure unit is Pascal (Pa) or N/m².',
                'Pressure increases when the contact area decreases.'
              ]),
              quickQuiz: JSON.stringify([
                {
                  question: 'Why do camels easily walk on desert sand?',
                  options: ['Their feet have small surface area', 'Their feet have large surface area to reduce pressure', 'They are lightweight', 'Sand has high friction'],
                  answer: 1,
                  explanation: 'Broad, large feet spread the weight across more surface area, reducing pressure so they do not sink into the sand.'
                }
              ])
            }
          ],
          questions: [
            {
              text: 'The SI unit of pressure is named after which scientist?',
              options: ['Newton', 'Galileo', 'Pascal', 'Joule'],
              correct: 2,
              explanation: 'The SI unit of pressure is the Pascal (Pa), equivalent to 1 Newton per square meter.'
            },
            {
              text: 'Which of the following is a non-contact force?',
              options: ['Friction', 'Tension', 'Gravitational force', 'Muscular force'],
              correct: 2,
              explanation: 'Gravitational force acts over distance without physical touch.'
            }
          ]
        },
        {
          title: 'Work, Energy and Simple Machines',
          description: 'Understand kinetic and potential energy, conservation of energy, levers and pulleys.',
          video: {
            title: 'Work, Energy and Power: Crash Course Physics #9',
            embedUrl: 'https://www.youtube.com/embed/w4QFJb9a8vo',
            duration: '09:55',
            licenseOrAuthorization: 'Authorized Educational Embed (Open Creative Commons)'
          },
          lessons: [
            {
              title: 'Kinetic & Potential Energy',
              objective: 'Distinguish mechanical energies and verify energy conservation.',
              simpleContent: 'Work is done when a force causes an object to move in the direction of the force: Work = Force × Distance. Energy is the capacity to do work. Moving objects possess Kinetic Energy (KE), while objects stored at height possess Gravitational Potential Energy (PE).',
              workedExample: 'A student lifts a 2 kg book by 1.5 meters against gravity (g ≈ 10 m/s²).\nPotential Energy = m × g × h = 2 × 10 × 1.5 = 30 Joules.',
              keyPoints: JSON.stringify([
                'Unit of Work and Energy is Joule (J).',
                'Law of Conservation of Energy: Energy cannot be created or destroyed, only transformed.',
                'Levers, pulleys and inclined planes make work easier by altering force direction or distance.'
              ]),
              quickQuiz: JSON.stringify([
                {
                  question: 'A stretched rubber band possesses which type of energy?',
                  options: ['Kinetic Energy', 'Thermal Energy', 'Potential Energy', 'Chemical Energy'],
                  answer: 2,
                  explanation: 'Elastic potential energy is stored in the stretched rubber band due to its deformed position.'
                }
              ])
            }
          ],
          questions: [
            {
              text: 'When a roller coaster descends from a peak, potential energy converts into:',
              options: ['Chemical energy', 'Kinetic energy', 'Nuclear energy', 'Magnetic energy'],
              correct: 1,
              explanation: 'As height decreases, potential energy is converted into kinetic energy of motion.'
            },
            {
              text: 'What is the formula for work done?',
              options: ['Force / Distance', 'Force × Distance', 'Mass × Acceleration', 'Energy × Time'],
              correct: 1,
              explanation: 'Work = Force × Displacement in the direction of force.'
            }
          ]
        },
        {
          title: 'Light, Sound and Electricity',
          description: 'Reflection, refraction, sound vibrations, electric circuits, conductors and Ohm basics.',
          video: {
            title: 'Geometric Optics and Light: Crash Course Physics #38',
            embedUrl: 'https://www.youtube.com/embed/Oh4m8Ees-3Q',
            duration: '10:36',
            licenseOrAuthorization: 'Authorized Educational Embed (Open Creative Commons)'
          },
          lessons: [
            {
              title: 'Reflection of Light and Circuit Fundamentals',
              objective: 'Learn laws of reflection and how electric current flows in a closed circuit.',
              simpleContent: 'Light travels in straight lines (rectilinear propagation). When it hits a shiny surface, it bounces back: this is reflection. In electric circuits, electrons flow from the negative to positive terminal through conductors when the switch is closed.',
              workedExample: 'Angle of incidence is 35°. What is the angle of reflection?\nBy the First Law of Reflection: Angle of incidence (i) = Angle of reflection (r), so r = 35°.',
              keyPoints: JSON.stringify([
                'First Law of Reflection: Angle of Incidence = Angle of Reflection.',
                'Sound requires a medium (solid, liquid, or gas) to travel; it cannot travel through a vacuum.',
                'A complete closed circuit is necessary for current to flow.'
              ]),
              quickQuiz: JSON.stringify([
                {
                  question: 'Can sound travel through outer space vacuum?',
                  options: ['Yes, faster than light', 'Yes, but very slowly', 'No, sound requires a material medium', 'Only during daytime'],
                  answer: 2,
                  explanation: 'Sound is a mechanical vibration wave that needs particles to propagate, so it cannot travel through empty space.'
                }
              ])
            }
          ],
          questions: [
            {
              text: 'According to the law of reflection, if the incident angle is 45°, the reflected angle is:',
              options: ['90°', '45°', '0°', '30°'],
              correct: 1,
              explanation: 'Angle of incidence equals angle of reflection (i = r = 45°).'
            },
            {
              text: 'Which of the following is a good conductor of electricity?',
              options: ['Rubber', 'Pure Water', 'Copper', 'Glass'],
              correct: 2,
              explanation: 'Copper has free valence electrons and is an excellent electrical conductor.'
            }
          ]
        }
      ]
    },
    {
      slug: 'chemistry',
      name: 'Chemistry',
      description: 'Discover atoms, molecules, states of matter, periodic elements and chemical reactions.',
      accentColor: 'green',
      icon: 'FlaskConical',
      order: 2,
      chapters: [
        {
          title: 'Matter Around Us',
          description: 'Solids, liquids, gases, plasma, melting, boiling, evaporation and condensation.',
          video: {
            title: "What's Matter? - Crash Course Kids #3.1",
            embedUrl: 'https://www.youtube.com/embed/ELchwUIlWa8',
            duration: '08:20',
            licenseOrAuthorization: 'Authorized Educational Embed (Open Creative Commons)'
          },
          lessons: [
            {
              title: 'Particulate Nature of Matter',
              objective: 'Observe how particle arrangement defines solid, liquid and gas properties.',
              simpleContent: 'Everything that occupies space and has mass is matter. Matter is composed of tiny particles that are constantly moving. In solids, particles are packed tightly. In liquids, they slide past each other. In gases, they move rapidly with vast spaces between them.',
              workedExample: 'Why does smell of hot sizzling food reach you several meters away, but to get smell from cold food you have to get close?\nSolution: Rate of diffusion increases with temperature because particles gain kinetic energy at higher temperatures.',
              keyPoints: JSON.stringify([
                'Matter has mass and volume.',
                'Sublimation is transition directly from solid to gas (e.g. camphor, dry ice).',
                'Evaporation causes cooling.'
              ]),
              quickQuiz: JSON.stringify([
                {
                  question: 'Which state of matter has a fixed volume but no fixed shape?',
                  options: ['Solid', 'Liquid', 'Gas', 'Plasma'],
                  answer: 1,
                  explanation: 'Liquids take the shape of their container while maintaining a constant volume.'
                }
              ])
            }
          ],
          questions: [
            {
              text: 'The process in which a solid turns directly into gas without melting is called:',
              options: ['Condensation', 'Sublimation', 'Evaporation', 'Deposition'],
              correct: 1,
              explanation: 'Sublimation is the direct change from solid to gas phase.'
            },
            {
              text: 'In which state of matter are intermolecular spaces the greatest?',
              options: ['Solid', 'Liquid', 'Gas', 'Colloid'],
              correct: 2,
              explanation: 'Gases have widely separated particles with maximum intermolecular space.'
            }
          ]
        },
        {
          title: 'Atoms and Molecules',
          description: 'Dalton atomic theory, subatomic particles (protons, neutrons, electrons) and chemical formulas.',
          video: {
            title: 'How Atoms and Molecules Bond',
            embedUrl: 'https://www.youtube.com/embed/FSyAehMdpyI',
            duration: '10:45',
            licenseOrAuthorization: 'Authorized Educational Embed (Open Creative Commons)'
          },
          lessons: [
            {
              title: 'Structure of the Atom',
              objective: 'Identify protons, neutrons in the nucleus and orbiting electrons.',
              simpleContent: 'An atom is the smallest indivisible unit of an element that retains its chemical properties. Protons (+ charge) and neutrons (neutral) reside in the dense central nucleus. Light electrons (- charge) revolve in shells around the nucleus.',
              workedExample: 'Carbon has 6 protons and 6 neutrons. What is its Mass Number?\nMass Number = Protons + Neutrons = 6 + 6 = 12.',
              keyPoints: JSON.stringify([
                'Atomic number (Z) = number of protons.',
                'Mass number (A) = protons + neutrons.',
                'Molecules consist of two or more chemically bonded atoms (e.g. H₂O).'
              ]),
              quickQuiz: JSON.stringify([
                {
                  question: 'What is the electrical charge of a neutron?',
                  options: ['Positive (+1)', 'Negative (-1)', 'Neutral (0)', 'Variable'],
                  answer: 2,
                  explanation: 'Neutrons carry zero electrical charge.'
                }
              ])
            }
          ],
          questions: [
            {
              text: 'The atomic number of an element is determined by its number of:',
              options: ['Neutrons', 'Protons', 'Electrons in outer shell', 'Total nucleons'],
              correct: 1,
              explanation: 'The atomic number (Z) equals the number of protons in the nucleus.'
            },
            {
              text: 'What is the chemical formula of common water?',
              options: ['HO', 'H₂O', 'H₂O₂', 'OH⁻'],
              correct: 1,
              explanation: 'Water contains two Hydrogen atoms bonded to one Oxygen atom (H₂O).'
            }
          ]
        },
        {
          title: 'Elements and the Periodic Table',
          description: 'Metals, non-metals, metalloids, groups, periods and periodic trends.',
          video: {
            title: 'Navigating the Modern Periodic Table',
            embedUrl: 'https://www.youtube.com/embed/0RRVV4Diomg',
            duration: '12:10',
            licenseOrAuthorization: 'Authorized Educational Embed (Open Creative Commons)'
          },
          lessons: [
            {
              title: 'Metals vs Non-Metals',
              objective: 'Classify elements by lustrous, malleable, ductile and conductivity traits.',
              simpleContent: 'Elements are the purest chemical substances. Metals (like iron, gold, copper) are shiny, ductile (can be drawn into wires), malleable (can be hammered into sheets), and good heat/electrical conductors. Non-metals (like oxygen, sulfur) are dull and brittle.',
              workedExample: 'Name a metal that exists as a liquid at room temperature.\nAnswer: Mercury (Hg) is the only liquid metal at standard room temperature.',
              keyPoints: JSON.stringify([
                'Mendeleev organized the first periodic table; Moseley modernized it by atomic number.',
                'Periods are horizontal rows; Groups are vertical columns.',
                'Noble gases (Group 18) are unreactive because their outer electron shells are full.'
              ]),
              quickQuiz: JSON.stringify([
                {
                  question: 'Which non-metal is an exceptional conductor of electricity?',
                  options: ['Sulfur', 'Phosphorus', 'Graphite (Carbon)', 'Diamond'],
                  answer: 2,
                  explanation: 'Graphite has delocalized electrons that allow it to conduct electricity despite being non-metallic.'
                }
              ])
            }
          ],
          questions: [
            {
              text: 'Which element has the chemical symbol Na?',
              options: ['Nickel', 'Nitrogen', 'Sodium', 'Neon'],
              correct: 2,
              explanation: 'Na comes from the Latin name Natrium, which denotes Sodium.'
            },
            {
              text: 'Vertical columns in the Periodic Table are called:',
              options: ['Periods', 'Groups', 'Series', 'Blocks'],
              correct: 1,
              explanation: 'Vertical columns are called Groups; horizontal rows are called Periods.'
            }
          ]
        },
        {
          title: 'Chemical Reactions',
          description: 'Reactants, products, balancing equations, combination, decomposition and displacement.',
          video: {
            title: 'Balancing Chemical Equations Step by Step',
            embedUrl: 'https://www.youtube.com/embed/2Juem0lcifE',
            duration: '13:00',
            licenseOrAuthorization: 'Authorized Educational Embed (Open Creative Commons)'
          },
          lessons: [
            {
              title: 'Balancing Equations and Types of Reactions',
              objective: 'Balance simple chemical equations based on the Law of Conservation of Mass.',
              simpleContent: 'During a chemical change, old chemical bonds break and new bonds form to produce new substances with different properties. Law of Conservation of Mass states that total mass of reactants must equal total mass of products.',
              workedExample: 'Balance: H₂ + O₂ → H₂O\nLeft: 2 H, 2 O. Right: 2 H, 1 O.\nMultiply right by 2: H₂ + O₂ → 2 H₂O\nNow Left: 2 H, Right: 4 H. Multiply left H₂ by 2: 2 H₂ + O₂ → 2 H₂O (Balanced!).',
              keyPoints: JSON.stringify([
                'Combination: A + B → AB',
                'Decomposition: AB → A + B',
                'Displacement: A + BC → AC + B',
                'Coefficients are adjusted to balance; subscripts must never be altered.'
              ]),
              quickQuiz: JSON.stringify([
                {
                  question: 'What kind of reaction occurs when iron rusts in moist air?',
                  options: ['Physical reaction', 'Oxidation reaction', 'Nuclear reaction', 'Decomposition'],
                  answer: 1,
                  explanation: 'Iron reacts with oxygen and water to form iron oxide (rust), which is an oxidation reaction.'
                }
              ])
            }
          ],
          questions: [
            {
              text: 'In the reaction 2Mg + O₂ → 2MgO, what are the reactants?',
              options: ['MgO only', 'Mg and O₂', 'Only Oxygen', 'Heat and light'],
              correct: 1,
              explanation: 'Reactants are the starting substances on the left side of the arrow: Magnesium (Mg) and Oxygen (O₂).'
            },
            {
              text: 'Why must chemical equations be balanced?',
              options: ['To look orderly', 'Law of Conservation of Mass', 'To increase reaction rate', 'To produce heat'],
              correct: 1,
              explanation: 'Matter cannot be created or destroyed in a chemical reaction.'
            }
          ]
        },
        {
          title: 'Acids, Bases and Salts',
          description: 'pH scale, litmus indicators, neutralization, common household acids, bases and salts.',
          video: {
            title: 'Acids, Bases and the pH Scale',
            embedUrl: 'https://www.youtube.com/embed/mnbS56HQbaU',
            duration: '11:40',
            licenseOrAuthorization: 'Authorized Educational Embed (Open Creative Commons)'
          },
          lessons: [
            {
              title: 'The pH Scale and Indicators',
              objective: 'Differentiate acids (pH < 7) and bases (pH > 7) and observe neutralization.',
              simpleContent: 'Acids taste sour and turn blue litmus paper red (e.g. citric acid in lemon, acetic acid in vinegar). Bases taste bitter, feel slippery/soapy, and turn red litmus blue (e.g. baking soda, soap). When an acid reacts with a base, they neutralize to form salt and water!',
              workedExample: 'Hydrochloric acid (HCl) + Sodium hydroxide (NaOH) → Sodium chloride (NaCl) + Water (H₂O). This is a classic neutralization reaction.',
              keyPoints: JSON.stringify([
                'pH 7 is neutral (pure water).',
                'pH 0 to 6.9 is acidic; pH 7.1 to 14 is alkaline/basic.',
                'Acid + Base → Salt + Water (Neutralization).'
              ]),
              quickQuiz: JSON.stringify([
                {
                  question: 'What color does red litmus paper turn in a basic solution?',
                  options: ['Red', 'Blue', 'Yellow', 'Green'],
                  answer: 1,
                  explanation: 'Bases turn red litmus paper blue.'
                }
              ])
            }
          ],
          questions: [
            {
              text: 'Pure water has a neutral pH of exactly:',
              options: ['0', '1', '7', '14'],
              correct: 2,
              explanation: 'Neutral solutions have a pH value of 7 at 25°C.'
            },
            {
              text: 'Which acid is naturally present in curd and yogurt?',
              options: ['Citric acid', 'Lactic acid', 'Tartaric acid', 'Acetic acid'],
              correct: 1,
              explanation: 'Lactobacillus bacteria ferment lactose into lactic acid in curd.'
            }
          ]
        }
      ]
    },
    {
      slug: 'mathematics',
      name: 'Mathematics',
      description: 'Strengthen numerical fluency, algebra, geometry, mensuration, data analysis and probability.',
      accentColor: 'orange',
      icon: 'Calculator',
      order: 3,
      chapters: [
        {
          title: 'Numbers and Operations',
          description: 'Integers, prime numbers, LCM, HCF, exponents, order of operations and BODMAS.',
          video: {
            title: 'Mastering BODMAS and Integer Arithmetic',
            embedUrl: 'https://www.youtube.com/embed/ClYdw4d4OmA',
            duration: '10:15',
            licenseOrAuthorization: 'Authorized Educational Embed (Open Creative Commons)'
          },
          lessons: [
            {
              title: 'Order of Operations (BODMAS)',
              objective: 'Solve multi-step numerical problems correctly following operator precedence.',
              simpleContent: 'To evaluate expressions accurately, we follow BODMAS: Brackets, Orders (powers/roots), Division, Multiplication, Addition, Subtraction. Calculating out of order yields an incorrect result!',
              workedExample: 'Calculate: 12 + 4 × (8 - 3) ÷ 2\nStep 1 (Brackets): 8 - 3 = 5\nStep 2: 12 + 4 × 5 ÷ 2\nStep 3 (Division): 5 ÷ 2 = 2.5 (or 4 × 5 = 20, then ÷ 2 = 10)\nStep 4: 12 + 10 = 22.',
              keyPoints: JSON.stringify([
                'BODMAS ensures consistent, unambiguous calculation.',
                'Negative × Negative = Positive.',
                'The HCF of two prime numbers is always 1.'
              ]),
              quickQuiz: JSON.stringify([
                {
                  question: 'What is the value of 5 + 3 × 4?',
                  options: ['32', '17', '20', '23'],
                  answer: 1,
                  explanation: 'By BODMAS, multiplication precedes addition: 3 × 4 = 12, then 5 + 12 = 17.'
                }
              ])
            }
          ],
          questions: [
            {
              text: 'Evaluate: 18 - 3 × (4 + 1)',
              options: ['75', '3', '15', '33'],
              correct: 1,
              explanation: 'Parentheses: 4 + 1 = 5. Multiplication: 3 × 5 = 15. Subtraction: 18 - 15 = 3.'
            },
            {
              text: 'What is the Lowest Common Multiple (LCM) of 4 and 6?',
              options: ['2', '12', '24', '18'],
              correct: 1,
              explanation: 'Multiples of 4: 4, 8, 12... Multiples of 6: 6, 12... The least common multiple is 12.'
            }
          ]
        },
        {
          title: 'Fractions, Decimals and Percentages',
          description: 'Equivalent fractions, decimal arithmetic, conversions, ratio and percentage calculations.',
          video: {
            title: 'Math Antics - Fractions Are Parts',
            embedUrl: 'https://www.youtube.com/embed/CA9XLJpQp3c',
            duration: '09:12',
            licenseOrAuthorization: 'Authorized Educational Embed (Open Creative Commons)'
          },
          lessons: [
            {
              title: 'Fraction to Percentage Mastery',
              objective: 'Convert seamlessly between parts of wholes, decimals, and percents.',
              simpleContent: 'Percent means "per hundred". To convert any fraction to a percentage, multiply by 100%. For example, 1/4 = (1/4) × 100% = 25%. To convert a decimal to a percentage, shift the decimal point two places to the right: 0.75 = 75%.',
              workedExample: 'A student scored 45 marks out of 50 in a science quiz. What is their percentage score?\nPercentage = (45 / 50) × 100% = 0.9 × 100% = 90%.',
              keyPoints: JSON.stringify([
                '1/2 = 50% = 0.5',
                '1/4 = 25% = 0.25',
                '3/4 = 75% = 0.75',
                'Percentage change = (Difference / Original value) × 100.'
              ]),
              quickQuiz: JSON.stringify([
                {
                  question: 'Convert 3/5 into a percentage.',
                  options: ['30%', '50%', '60%', '75%'],
                  answer: 2,
                  explanation: '(3 / 5) × 100 = 3 × 20 = 60%.'
                }
              ])
            }
          ],
          questions: [
            {
              text: 'What is 15% of 200?',
              options: ['15', '20', '30', '45'],
              correct: 2,
              explanation: '15/100 × 200 = 15 × 2 = 30.'
            },
            {
              text: 'Which fraction is equivalent to 0.125?',
              options: ['1/8', '1/4', '1/5', '1/12'],
              correct: 0,
              explanation: '1 ÷ 8 = 0.125.'
            }
          ]
        },
        {
          title: 'Algebra and Equations',
          description: 'Variables, coefficients, like terms, solving linear equations and simple word problems.',
          video: {
            title: 'Solving Linear Equations in One Variable',
            embedUrl: 'https://www.youtube.com/embed/l3XzepN03KQ',
            duration: '11:25',
            licenseOrAuthorization: 'Authorized Educational Embed (Open Creative Commons)'
          },
          lessons: [
            {
              title: 'Solving One-Step and Two-Step Equations',
              objective: 'Isolate variables using inverse operations to solve linear equations.',
              simpleContent: 'An algebraic equation is like a balanced balance scale. Whatever operation you apply to one side, you must apply equally to the other. To isolate the unknown variable x, undo addition with subtraction, and undo multiplication with division.',
              workedExample: 'Solve for x: 3x + 7 = 22\nStep 1: Subtract 7 from both sides: 3x = 15\nStep 2: Divide both sides by 3: x = 5.\nCheck: 3(5) + 7 = 15 + 7 = 22 (Correct!).',
              keyPoints: JSON.stringify([
                'Variable: a symbol representing an unknown value (usually x, y).',
                'Coefficient: numerical factor of a term (in 5x, 5 is the coefficient).',
                'Maintain balance by performing identical operations on both sides.'
              ]),
              quickQuiz: JSON.stringify([
                {
                  question: 'If 2y - 4 = 10, what is the value of y?',
                  options: ['3', '5', '7', '8'],
                  answer: 2,
                  explanation: '2y = 10 + 4 = 14 => y = 14 / 2 = 7.'
                }
              ])
            }
          ],
          questions: [
            {
              text: 'Solve for p: 4p + 8 = 28',
              options: ['4', '5', '6', '7'],
              correct: 1,
              explanation: '4p = 28 - 8 = 20. Then p = 20 / 4 = 5.'
            },
            {
              text: 'In the expression 7a² - 3b + 9, the coefficient of b is:',
              options: ['7', '3', '-3', '9'],
              correct: 2,
              explanation: 'The term is -3b, so the coefficient is -3.'
            }
          ]
        },
        {
          title: 'Geometry and Mensuration',
          description: 'Angles, triangles, perimeter, area of 2D shapes, volume and surface area of prisms.',
          video: {
            title: 'Perimeter and Area Formulas Explained',
            embedUrl: 'https://www.youtube.com/embed/xCdxURXMdFY',
            duration: '12:40',
            licenseOrAuthorization: 'Authorized Educational Embed (Open Creative Commons)'
          },
          lessons: [
            {
              title: 'Area and Perimeter of Rectangles, Triangles and Circles',
              objective: 'Apply geometric formulas to calculate boundary length and interior space.',
              simpleContent: 'Perimeter is the total boundary distance around a shape. Area is the quantity of 2D surface enclosed. Rectangle: Area = l × w. Triangle: Area = 1/2 × base × height. Circle: Circumference = 2πr, Area = πr².',
              workedExample: 'A right triangle has a base of 6 cm and height of 8 cm. What is its area?\nArea = 1/2 × base × height = 1/2 × 6 × 8 = 24 cm².',
              keyPoints: JSON.stringify([
                'Sum of angles in any triangle is always 180°.',
                'Pythagorean Theorem: a² + b² = c² for right-angled triangles.',
                'Perimeter is in linear units (cm, m); Area is in square units (cm², m²).'
              ]),
              quickQuiz: JSON.stringify([
                {
                  question: 'What is the sum of interior angles in a four-sided quadrilateral?',
                  options: ['180°', '270°', '360°', '540°'],
                  answer: 2,
                  explanation: 'Any quadrilateral can be divided into 2 triangles (2 × 180° = 360°).'
                }
              ])
            }
          ],
          questions: [
            {
              text: 'The perimeter of a square with side length 9 cm is:',
              options: ['18 cm', '36 cm', '81 cm', '27 cm'],
              correct: 1,
              explanation: 'Perimeter = 4 × side = 4 × 9 = 36 cm.'
            },
            {
              text: 'If the radius of a circle is 7 cm, what is its circumference? (Use π ≈ 22/7)',
              options: ['22 cm', '44 cm', '88 cm', '154 cm'],
              correct: 1,
              explanation: 'Circumference = 2 × (22/7) × 7 = 44 cm.'
            }
          ]
        },
        {
          title: 'Data, Graphs and Basic Probability',
          description: 'Mean, median, mode, range, bar charts, pie charts, histograms and likelihood of events.',
          video: {
            title: 'Math Antics - Mean, Median and Mode',
            embedUrl: 'https://www.youtube.com/embed/B1HEzNTGeZ4',
            duration: '11:04',
            licenseOrAuthorization: 'Authorized Educational Embed (Open Creative Commons)'
          },
          lessons: [
            {
              title: 'Measures of Central Tendency & Probability',
              objective: 'Calculate average (mean), middle value (median), and determine event probability.',
              simpleContent: 'Mean is the sum of values divided by count of values. Median is the middle number when sorted. Mode is the most frequent value. Probability of an event = Number of favorable outcomes ÷ Total possible outcomes.',
              workedExample: 'Find the mean of numbers: 4, 6, 8, 10, 12.\nSum = 4 + 6 + 8 + 10 + 12 = 40. Count = 5.\nMean = 40 / 5 = 8.',
              keyPoints: JSON.stringify([
                'Probability is always between 0 (impossible) and 1 (certain).',
                'Mean = Total sum / Number of items.',
                'Median requires numbers to be arranged in ascending order first.'
              ]),
              quickQuiz: JSON.stringify([
                {
                  question: 'What is the probability of rolling a 4 on a fair 6-sided die?',
                  options: ['1/2', '1/4', '1/6', '4/6'],
                  answer: 2,
                  explanation: 'There is only 1 face with a 4 out of 6 total possibilities: 1/6.'
                }
              ])
            }
          ],
          questions: [
            {
              text: 'Find the median of the dataset: 3, 7, 9, 12, 15',
              options: ['7', '9', '12', '9.2'],
              correct: 1,
              explanation: 'In the sorted list of 5 elements, the 3rd element (middle) is 9.'
            },
            {
              text: 'If a bag has 3 red marbles and 7 blue marbles, what is the probability of picking a red marble?',
              options: ['3/7', '3/10', '7/10', '1/3'],
              correct: 1,
              explanation: 'Favorable (red) = 3; Total = 3 + 7 = 10. Probability = 3/10 (30%).'
            }
          ]
        }
      ]
    },
    {
      slug: 'biology',
      name: 'Biology',
      description: 'Investigate the living world, cell biology, plant life processes, human anatomy and ecosystems.',
      accentColor: 'pink',
      icon: 'Dna',
      order: 4,
      chapters: [
        {
          title: 'Living and Non-Living Things',
          description: 'Characteristics of life: cellular organization, metabolism, growth, reproduction and adaptation.',
          video: {
            title: 'Characteristics of Living Organisms',
            embedUrl: 'https://www.youtube.com/embed/cQPVXrV0GNA',
            duration: '08:30',
            licenseOrAuthorization: 'Authorized Educational Embed (Open Creative Commons)'
          },
          lessons: [
            {
              title: 'The Seven Signs of Life (MRS GREN)',
              objective: 'Identify essential life processes shared by all living organisms.',
              simpleContent: 'All living organisms exhibit seven basic characteristics, remembered by MRS GREN: Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, and Nutrition. Non-living objects might show one trait (like a crystal growing), but only living things display all seven.',
              workedExample: 'Why is a car that burns fuel and moves not considered alive?\nAnswer: While a car consumes fuel and moves, it cannot reproduce, grow, or respond to biological stimuli.',
              keyPoints: JSON.stringify([
                'Cell is the basic structural and functional unit of life.',
                'Metabolism refers to all chemical reactions sustaining life in an organism.',
                'Homeostasis maintains a stable internal environment.'
              ]),
              quickQuiz: JSON.stringify([
                {
                  question: 'Which of the following is an example of excretion in humans?',
                  options: ['Inhaling oxygen', 'Sweating and urination', 'Chewing food', 'Sleeping'],
                  answer: 1,
                  explanation: 'Excretion is the removal of metabolic waste products from the body.'
                }
              ])
            }
          ],
          questions: [
            {
              text: 'Which biological process converts food nutrients into usable energy (ATP)?',
              options: ['Digestion', 'Respiration', 'Circulation', 'Photosynthesis'],
              correct: 1,
              explanation: 'Cellular respiration releases biochemical energy from nutrients in cells.'
            },
            {
              text: 'The ability of an organism to detect and react to changes in its surroundings is called:',
              options: ['Sensitivity (Response to stimuli)', 'Excretion', 'Locomotion', 'Egestion'],
              correct: 0,
              explanation: 'Sensitivity is the capacity to sense stimuli and produce an appropriate reaction.'
            }
          ]
        },
        {
          title: 'Cells and Their Functions',
          description: 'Plant vs animal cells, nucleus, mitochondria, cell membrane, chloroplasts and cell division.',
          video: {
            title: 'Cell Structure and Organelles',
            embedUrl: 'https://www.youtube.com/embed/URUJD5NEXC8',
            duration: '11:55',
            licenseOrAuthorization: 'Authorized Educational Embed (Open Creative Commons)'
          },
          lessons: [
            {
              title: 'Plant Cells vs Animal Cells',
              objective: 'Compare cell walls, chloroplasts, central vacuoles and cell organelles.',
              simpleContent: 'Cells are microscopic building blocks of life. Both plant and animal cells have a nucleus (controls cell activity), mitochondria (powerhouse that generates energy), and cell membrane. However, plant cells have unique structures: a rigid cellulose cell wall, large central vacuole, and green chloroplasts for photosynthesis.',
              workedExample: 'Under a microscope, you observe a cell with a thick outer boundary and green oval organelles. What kind of cell is it?\nAnswer: It is a plant cell because of the cellulose cell wall and chloroplasts containing chlorophyll.',
              keyPoints: JSON.stringify([
                'Mitochondria: Powerhouse of the cell.',
                'Nucleus: Brain of the cell containing genetic material (DNA).',
                'Chloroplasts: Site of photosynthesis in autotrophic plants.'
              ]),
              quickQuiz: JSON.stringify([
                {
                  question: 'Which organelle is known as the "powerhouse of the cell"?',
                  options: ['Ribosome', 'Mitochondria', 'Golgi apparatus', 'Vacuole'],
                  answer: 1,
                  explanation: 'Mitochondria synthesize adenosine triphosphate (ATP), the energy currency of cells.'
                }
              ])
            }
          ],
          questions: [
            {
              text: 'Which structure is present in plant cells but absent in animal cells?',
              options: ['Cell membrane', 'Mitochondria', 'Cell wall', 'Nucleus'],
              correct: 2,
              explanation: 'Plant cells have a rigid outer cellulose cell wall that gives mechanical support.'
            },
            {
              text: 'The jelly-like fluid that fills the cell and suspends organelles is the:',
              options: ['Cytoplasm', 'Plasma', 'Chlorophyll', 'Lysosome'],
              correct: 0,
              explanation: 'Cytoplasm is the gel-like substance enclosed by the cell membrane.'
            }
          ]
        },
        {
          title: 'Plants and Life Processes',
          description: 'Photosynthesis, transpiration, xylem and phloem transport, flower reproduction and seed dispersal.',
          video: {
            title: 'Photosynthesis and Plant Vascular Systems',
            embedUrl: 'https://www.youtube.com/embed/UPBMG5EYydo',
            duration: '10:35',
            licenseOrAuthorization: 'Authorized Educational Embed (Open Creative Commons)'
          },
          lessons: [
            {
              title: 'Photosynthesis and Vascular Transport',
              objective: 'Formulate the chemical equation of photosynthesis and trace water/food transport.',
              simpleContent: 'Green plants make their own food through photosynthesis using sunlight, chlorophyll, water from roots, and carbon dioxide from air: 6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ (Glucose) + 6O₂. Water travels up through Xylem vessels; synthesized food travels throughout via Phloem.',
              workedExample: 'Where does carbon dioxide enter a plant leaf?\nAnswer: Carbon dioxide enters through microscopic pores called stomata, controlled by guard cells.',
              keyPoints: JSON.stringify([
                'Photosynthesis produces glucose and releases oxygen gas as a byproduct.',
                'Xylem transports water and dissolved minerals from roots to leaves.',
                'Phloem conducts dissolved sugars from leaves to all plant parts.'
              ]),
              quickQuiz: JSON.stringify([
                {
                  question: 'What green pigment in leaves captures sunlight for photosynthesis?',
                  options: ['Hemoglobin', 'Chlorophyll', 'Carotene', 'Anthocyanin'],
                  answer: 1,
                  explanation: 'Chlorophyll molecules inside chloroplasts absorb photons from solar radiation.'
                }
              ])
            }
          ],
          questions: [
            {
              text: 'The microscopic pores on leaf surfaces that regulate gas exchange are called:',
              options: ['Chloroplasts', 'Stomata', 'Spiracles', 'Veins'],
              correct: 1,
              explanation: 'Stomata are tiny openings surrounded by guard cells that facilitate gas exchange.'
            },
            {
              text: 'Which tissue transports water and minerals upwards from roots in plants?',
              options: ['Phloem', 'Xylem', 'Cortex', 'Cambium'],
              correct: 1,
              explanation: 'Xylem conducts water and minerals unidirectionally from roots to aerial parts.'
            }
          ]
        },
        {
          title: 'Human Body and Health',
          description: 'Digestive system, circulatory system, respiratory system, nervous system, nutrition and hygiene.',
          video: {
            title: 'Overview of Human Body Organ Systems',
            embedUrl: 'https://www.youtube.com/embed/gEUu-A2wfSE',
            duration: '13:15',
            licenseOrAuthorization: 'Authorized Educational Embed (Open Creative Commons)'
          },
          lessons: [
            {
              title: 'Digestive & Circulatory Synergy',
              objective: 'Trace the path of nutrients from digestion into blood circulation to body cells.',
              simpleContent: 'The digestive system breaks down complex food into simple soluble nutrients (carbohydrates into glucose, proteins into amino acids, fats into fatty acids). The heart pumps oxygenated blood and nutrients through arteries to every cell, collecting carbon dioxide waste through veins.',
              workedExample: 'Which blood vessels carry oxygen-rich blood away from the heart to body organs?\nAnswer: Arteries carry oxygenated blood away from the heart (with the exception of pulmonary arteries).',
              keyPoints: JSON.stringify([
                'Human heart has 4 chambers: two atria and two ventricles.',
                'Red blood cells contain hemoglobin to carry oxygen.',
                'Small intestine has villi to maximize nutrient absorption surface area.'
              ]),
              quickQuiz: JSON.stringify([
                {
                  question: 'Where does most chemical digestion and nutrient absorption occur in the human body?',
                  options: ['Stomach', 'Small Intestine', 'Large Intestine', 'Esophagus'],
                  answer: 1,
                  explanation: 'The small intestine (duodenum, jejunum, ileum) absorbs over 90% of digested nutrients.'
                }
              ])
            }
          ],
          questions: [
            {
              text: 'Which gas is exchanged into the bloodstream during inhalation in the lungs?',
              options: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'],
              correct: 2,
              explanation: 'Oxygen diffuses from alveoli into lung capillaries to oxygenate red blood cells.'
            },
            {
              text: 'Which organ filters metabolic wastes from blood to produce urine?',
              options: ['Liver', 'Kidneys', 'Pancreas', 'Gallbladder'],
              correct: 1,
              explanation: 'The kidneys filter blood through nephrons to excrete urea and excess salts.'
            }
          ]
        },
        {
          title: 'Ecosystems, Environment and Life',
          description: 'Biotic and abiotic factors, food chains, food webs, trophic levels and environmental conservation.',
          video: {
            title: 'What Are Ecosystems? Crash Course Geography #15',
            embedUrl: 'https://www.youtube.com/embed/KQF9WdZrH_c',
            duration: '11:32',
            licenseOrAuthorization: 'Authorized Educational Embed (Open Creative Commons)'
          },
          lessons: [
            {
              title: 'Food Chains and the 10% Energy Rule',
              objective: 'Model trophic levels and energy flow from producers to apex consumers.',
              simpleContent: 'An ecosystem consists of biotic (living plants, animals, bacteria) and abiotic (sunlight, soil, water, air) components. Energy flows linearly: Sun → Producers (Plants) → Herbivores → Carnivores. According to Lindeman’s 10% Law, only about 10% of energy is transferred from one trophic level to the next!',
              workedExample: 'If green plants capture 10,000 Joules of energy from sunlight, how much energy is transferred to herbivores?\nBy the 10% Law: 10,000 J × 10% = 1,000 Joules.',
              keyPoints: JSON.stringify([
                'Producers make food through photosynthesis; consumers feed on other organisms.',
                'Decomposers (fungi, bacteria) recycle organic nutrients back into the soil.',
                'Only ~10% of energy moves to the next trophic level; 90% is lost as metabolic heat.'
              ]),
              quickQuiz: JSON.stringify([
                {
                  question: 'What is the primary source of energy for almost all terrestrial ecosystems?',
                  options: ['Geothermal heat', 'Sunlight', 'Ocean tides', 'Nuclear energy'],
                  answer: 1,
                  explanation: 'Sunlight fuels photosynthesis in autotrophic plants, driving terrestrial food webs.'
                }
              ])
            }
          ],
          questions: [
            {
              text: 'Organisms that break down dead organic matter and return nutrients to soil are:',
              options: ['Producers', 'Decomposers', 'Primary consumers', 'Parasites'],
              correct: 1,
              explanation: 'Decomposers like fungi and bacteria recycle nutrients by decomposing organic matter.'
            },
            {
              text: 'In a grassland food chain: Grass → Grasshopper → Frog → Snake, what is the secondary consumer?',
              options: ['Grass', 'Grasshopper', 'Frog', 'Snake'],
              correct: 2,
              explanation: 'Grass is producer; Grasshopper is primary consumer; Frog is secondary consumer.'
            }
          ]
        }
      ]
    }
  ]

  const createdSubjects: Record<string, any> = {}
  const allCreatedQuestions: any[] = []

  for (const s of subjectsData) {
    const createdSubject = await prisma.subject.create({
      data: {
        slug: s.slug,
        name: s.name,
        description: s.description,
        accentColor: s.accentColor,
        icon: s.icon,
        order: s.order,
      }
    })
    createdSubjects[s.name] = createdSubject
    console.log(`Created Subject: ${s.name}`)

    let chapterOrder = 1
    for (const ch of s.chapters) {
      const createdChapter = await prisma.chapter.create({
        data: {
          title: ch.title,
          description: ch.description,
          order: chapterOrder++,
          subjectId: createdSubject.id,
          classLevelId: classLevels['Class 8'].id,
          video: {
            create: {
              title: ch.video.title,
              embedUrl: ch.video.embedUrl,
              duration: ch.video.duration,
              licenseOrAuthorization: ch.video.licenseOrAuthorization,
              provider: 'youtube',
            }
          }
        }
      })

      // Lessons
      let lessonOrder = 1
      for (const les of ch.lessons) {
        await prisma.lesson.create({
          data: {
            title: les.title,
            order: lessonOrder++,
            objective: les.objective,
            simpleContent: les.simpleContent,
            workedExample: les.workedExample,
            keyPoints: les.keyPoints,
            quickQuiz: les.quickQuiz,
            chapterId: createdChapter.id
          }
        })
      }

      // Questions
      for (const q of ch.questions) {
        const createdQ = await prisma.question.create({
          data: {
            chapterId: createdChapter.id,
            questionText: q.text,
            options: JSON.stringify(q.options),
            correctOption: q.correct,
            explanation: q.explanation,
            difficulty: 'Medium'
          }
        })
        allCreatedQuestions.push({ ...createdQ, subjectName: s.name })
      }
    }
  }

  // 5. Initialize Student Progress records as specified:
  // Physics: 72%, Chemistry: 56%, Mathematics: 64%, Biology: 38%
  const progressTarget: Record<string, number> = {
    Physics: 72,
    Chemistry: 56,
    Mathematics: 64,
    Biology: 38
  }

  for (const [subjName, pct] of Object.entries(progressTarget)) {
    const subj = createdSubjects[subjName]
    if (subj) {
      await prisma.progress.create({
        data: {
          userId: demoUser.id,
          subjectId: subj.id,
          percentage: pct,
          completedLessons: JSON.stringify(['demo-lesson-1', 'demo-lesson-2']),
        }
      })
    }
  }
  console.log('Initialized Student Progress targets')

  // 6. Create 10 Comprehensive Tests across subjects and classes
  const testsSpec = [
    { title: 'Class 8 Physics: Units, Motion & Speed', subject: 'Physics', class: 'Class 8', duration: 15, marks: 10 },
    { title: 'Class 8 Physics: Force, Pressure & Energy Diagnostic', subject: 'Physics', class: 'Class 8', duration: 20, marks: 10 },
    { title: 'Class 7 Physics: Sound & Light Fundamentals', subject: 'Physics', class: 'Class 7', duration: 15, marks: 10 },
    { title: 'Class 8 Chemistry: Matter & Atoms Assessment', subject: 'Chemistry', class: 'Class 8', duration: 20, marks: 10 },
    { title: 'Class 10 Chemistry: Periodic Elements & Chemical Reactions', subject: 'Chemistry', class: 'Class 10', duration: 25, marks: 10 },
    { title: 'Class 10 Physics: Electricity, Circuits & Magnetic Effects', subject: 'Physics', class: 'Class 10', duration: 20, marks: 10 },
    { title: 'Class 8 Chemistry: Acids, Bases & Salts Review', subject: 'Chemistry', class: 'Class 8', duration: 15, marks: 10 },
    { title: 'Class 8 Mathematics: BODMAS & Linear Algebra Test', subject: 'Mathematics', class: 'Class 8', duration: 25, marks: 10 },
    { title: 'Class 8 Mathematics: Geometry, Area & Mensuration', subject: 'Mathematics', class: 'Class 8', duration: 20, marks: 10 },
    { title: 'Class 8 Biology: Cell Biology & Plant Life Processes', subject: 'Biology', class: 'Class 8', duration: 20, marks: 10 },
    { title: 'Class 8 Biology: Human Body Systems & Ecosystems', subject: 'Biology', class: 'Class 8', duration: 20, marks: 10 },
  ]

  for (let i = 0; i < testsSpec.length; i++) {
    const t = testsSpec[i]
    const subj = createdSubjects[t.subject]
    const cl = classLevels[t.class] || classLevels['Class 8']
    
    // Pick questions from the same subject
    const subjectQuestions = allCreatedQuestions.filter(q => q.subjectName === t.subject)
    
    const createdTest = await prisma.test.create({
      data: {
        title: t.title,
        description: `Comprehensive CBSE-aligned diagnostic test for ${t.class} ${t.subject}. Timed challenge with instant server evaluation.`,
        durationMin: t.duration,
        totalMarks: t.marks,
        passMarks: 5,
        isPublished: true,
        subjectId: subj.id,
        classLevelId: cl.id,
      }
    })

    // Associate questions with test
    let qOrder = 1
    for (const q of subjectQuestions) {
      await prisma.testQuestion.create({
        data: {
          testId: createdTest.id,
          questionId: q.id,
          order: qOrder++
        }
      })
    }
  }
  console.log('Created 10 Demo Tests with associated questions')

  // 7. Seed Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: demoUser.id,
        title: 'Upcoming Diagnostic Test',
        message: 'Class 8 Physics: Units, Motion & Speed is scheduled for your weekly challenge.',
        type: 'test',
        link: '/test',
        isRead: false,
      },
      {
        userId: demoUser.id,
        title: 'Practice Milestone Completed',
        message: 'You scored 100% on the Force and Pressure practice module! Keep the streak going.',
        type: 'success',
        link: '/practice',
        isRead: false,
      },
      {
        userId: demoUser.id,
        title: 'New Chapter Available',
        message: 'Light, Sound and Electricity is now unlocked with an interactive video simulation.',
        type: 'info',
        link: '/subjects',
        isRead: true,
      },
      {
        userId: demoUser.id,
        title: 'Welcome to EduBridge!',
        message: 'Your personalized AI Tutor is ready to guide you step-by-step.',
        type: 'info',
        link: '/dashboard',
        isRead: true,
      }
    ]
  })
  console.log('Created Seed Notifications')

  console.log('✅ EduBridge database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
