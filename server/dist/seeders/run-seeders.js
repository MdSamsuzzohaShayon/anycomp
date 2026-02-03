"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
async function run() {
    const seeder = new index_1.Seeder();
    // Get command line arguments
    const command = process.argv[2];
    switch (command) {
        case 'seed':
            await seeder.seedAll();
            break;
        case 'truncate':
            await seeder.truncateAll();
            break;
        case 'refresh':
            await seeder.refresh();
            break;
        case 'specific':
            const seederName = process.argv[3];
            if (!seederName) {
                console.error('❌ Please provide a seeder name. Usage: npm run seed:specific <seederName>');
                console.error('   Available seeders: platformfee, specialist, serviceoffering, media');
                process.exit(1);
            }
            await seeder.seedSpecific(seederName);
            break;
        default:
            console.log('Available commands:');
            console.log('  npm run seed           - Seed all data');
            console.log('  npm run seed:truncate  - Truncate all tables');
            console.log('  npm run seed:refresh   - Truncate and re-seed all');
            console.log('  npm run seed:specific <name> - Run specific seeder');
            console.log('\nAvailable seeder names:');
            console.log('  - platformfee');
            console.log('  - specialist');
            console.log('  - serviceoffering');
            console.log('  - media');
            break;
    }
    process.exit(0);
}
run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
